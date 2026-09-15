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

