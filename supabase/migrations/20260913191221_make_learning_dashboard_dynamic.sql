create table public.learning_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  completion_key text not null,
  source text not null check (source in ('daily', 'path')),
  step_number smallint check (step_number is null or step_number between 1 and 48),
  unit_number smallint check (unit_number is null or unit_number between 1 and 8),
  xp_earned integer not null default 25 check (xp_earned >= 0),
  completed_at timestamptz not null default now(),
  primary key (user_id, completion_key),
  check (
    (source = 'daily' and step_number is null)
    or (source = 'path' and step_number is not null and unit_number is not null)
  )
);

create index learning_completions_user_completed_idx
  on public.learning_completions (user_id, completed_at desc);

alter table public.learning_completions enable row level security;

create policy "Users can read their own learning completions"
on public.learning_completions for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.learning_completions from anon, authenticated;
grant select on table public.learning_completions to authenticated;

create or replace function public.get_learning_dashboard()
returns table (
  current_streak integer,
  longest_streak integer,
  total_xp bigint,
  practiced_words bigint,
  completed_steps bigint,
  lessons_completed bigint,
  today_daily_lessons bigint,
  activity jsonb
)
language sql
stable
security invoker
set search_path = ''
as $$
  with learner_day as (
    select coalesce(
      (
        select (now() at time zone p.timezone)::date
        from public.profiles p
        where p.id = auth.uid()
      ),
      (now() at time zone 'Asia/Tbilisi')::date
    ) as today
  )
  select
    case
      when s.last_activity_date is null or s.last_activity_date < d.today - 1 then 0
      else s.current_streak
    end,
    coalesce(s.longest_streak, 0),
    coalesce((
      select sum(a.xp_earned)
      from public.daily_activity a
      where a.user_id = auth.uid()
    ), 0)::bigint,
    coalesce((
      select count(*)
      from public.word_memory w
      where w.user_id = auth.uid()
    ), 0)::bigint,
    coalesce((
      select count(*)
      from public.learning_path_progress p
      where p.user_id = auth.uid()
    ), 0)::bigint,
    coalesce((
      select sum(a.lessons_completed)
      from public.daily_activity a
      where a.user_id = auth.uid()
    ), 0)::bigint,
    coalesce((
      select count(*)
      from public.learning_completions c
      where c.user_id = auth.uid()
        and c.source = 'daily'
        and c.completion_key like 'daily:' || d.today::text || ':%'
    ), 0)::bigint,
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'activity_date', recent.activity_date,
          'xp_earned', recent.xp_earned,
          'phrases_practiced', recent.phrases_practiced,
          'lessons_completed', recent.lessons_completed,
          'correct_answers', recent.correct_answers,
          'minutes_spent', recent.minutes_spent
        ) order by recent.activity_date asc
      )
      from (
        select a.*
        from public.daily_activity a
        where a.user_id = auth.uid()
        order by a.activity_date desc
        limit 30
      ) recent
    ), '[]'::jsonb)
  from learner_day d
  left join public.streaks s on s.user_id = auth.uid();
$$;

revoke all on function public.get_learning_dashboard() from public, anon;
grant execute on function public.get_learning_dashboard() to authenticated;

create or replace function public.complete_learning_session(
  p_source text,
  p_step_number smallint default null,
  p_unit_number smallint default null,
  p_micro_lesson smallint default 0,
  p_minutes integer default 3
)
returns table (
  current_streak integer,
  longest_streak integer,
  total_xp bigint,
  practiced_words bigint,
  completed_steps bigint,
  lessons_completed bigint,
  today_daily_lessons bigint,
  activity jsonb
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date;
  v_completion_key text;
  v_inserted integer;
  v_completion_xp integer := 25;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if not public.has_guided_learning_access() then
    raise exception 'Guided Learning subscription required' using errcode = '42501';
  end if;
  if p_source not in ('daily', 'path') then
    raise exception 'Invalid learning source' using errcode = '22023';
  end if;
  if p_minutes < 0 or p_minutes > 60 then
    raise exception 'Minutes must be between 0 and 60' using errcode = '22023';
  end if;
  if p_micro_lesson < 0 or p_micro_lesson > 20 then
    raise exception 'Invalid mini lesson number' using errcode = '22023';
  end if;
  if p_source = 'path' and (
    p_step_number is null or p_step_number not between 1 and 48
    or p_unit_number is null or p_unit_number not between 1 and 8
  ) then
    raise exception 'Invalid path step' using errcode = '22023';
  end if;

  select (now() at time zone p.timezone)::date
  into v_today
  from public.profiles p
  where p.id = v_user_id;
  v_today := coalesce(v_today, (now() at time zone 'Asia/Tbilisi')::date);

  v_completion_key := case
    when p_source = 'daily'
      then format('daily:%s:%s', v_today, p_micro_lesson)
    else format('path:%s', p_step_number)
  end;

  insert into public.learning_completions (
    user_id, completion_key, source, step_number, unit_number, xp_earned
  ) values (
    v_user_id, v_completion_key, p_source, p_step_number, p_unit_number,
    v_completion_xp
  )
  on conflict (user_id, completion_key) do nothing;
  get diagnostics v_inserted = row_count;

  if p_source = 'path' then
    insert into public.learning_path_progress (user_id, step_number, unit_number)
    values (v_user_id, p_step_number, p_unit_number)
    on conflict (user_id, step_number) do update
    set unit_number = excluded.unit_number;
  end if;

  if v_inserted > 0 then
    insert into public.daily_activity (
      user_id, activity_date, lessons_completed, xp_earned, minutes_spent
    ) values (
      v_user_id, v_today, 1, v_completion_xp, p_minutes
    )
    on conflict (user_id, activity_date) do update
    set lessons_completed = public.daily_activity.lessons_completed + 1,
        xp_earned = public.daily_activity.xp_earned + v_completion_xp,
        minutes_spent = public.daily_activity.minutes_spent + p_minutes;

    insert into public.streaks (
      user_id, current_streak, longest_streak, last_activity_date
    ) values (v_user_id, 1, 1, v_today)
    on conflict (user_id) do update
    set current_streak = case
          when public.streaks.last_activity_date = v_today
            then public.streaks.current_streak
          when public.streaks.last_activity_date = v_today - 1
            then public.streaks.current_streak + 1
          else 1
        end,
        longest_streak = greatest(
          public.streaks.longest_streak,
          case
            when public.streaks.last_activity_date = v_today
              then public.streaks.current_streak
            when public.streaks.last_activity_date = v_today - 1
              then public.streaks.current_streak + 1
            else 1
          end
        ),
        last_activity_date = v_today,
        updated_at = now();
  end if;

  return query select * from public.get_learning_dashboard();
end;
$$;

revoke all on function public.complete_learning_session(text, smallint, smallint, smallint, integer)
from public, anon;
grant execute on function public.complete_learning_session(text, smallint, smallint, smallint, integer)
to authenticated;
