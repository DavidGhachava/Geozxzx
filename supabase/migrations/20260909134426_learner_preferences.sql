create table public.learner_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  primary_goal text not null check (
    primary_goal in (
      'general_speaking', 'social', 'cafe', 'work', 'shopping',
      'transport', 'home', 'health', 'services'
    )
  ),
  focus_areas text[] not null default '{}',
  experience_level text not null check (
    experience_level in ('brand_new', 'some_basics', 'conversational')
  ),
  learning_pace text not null check (
    learning_pace in ('gentle', 'steady', 'intensive')
  ),
  custom_focus text check (
    custom_focus is null or char_length(custom_focus) between 1 and 240
  ),
  discovery_source text check (
    discovery_source is null or discovery_source in (
      'search', 'friend', 'social_media', 'community', 'work', 'other'
    )
  ),
  onboarding_version smallint not null default 1 check (onboarding_version > 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    focus_areas <@ array[
      'social', 'cafe', 'work', 'shopping', 'transport',
      'home', 'health', 'services'
    ]::text[]
  ),
  check (cardinality(focus_areas) between 1 and 5)
);

create trigger learner_preferences_set_updated_at
before update on public.learner_preferences
for each row execute function private.set_updated_at();

alter table public.learner_preferences enable row level security;

create policy "Users can read their own learner preferences"
on public.learner_preferences for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own learner preferences"
on public.learner_preferences for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own learner preferences"
on public.learner_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own learner preferences"
on public.learner_preferences for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.learner_preferences from anon, authenticated;
grant select, insert, update, delete on table public.learner_preferences
to authenticated;

alter table public.word_memory
  drop constraint if exists word_memory_unit_number_check;
alter table public.word_memory
  add constraint word_memory_unit_number_check
  check (unit_number between 1 and 8);

alter table public.learning_path_progress
  drop constraint if exists learning_path_progress_step_number_check;
alter table public.learning_path_progress
  drop constraint if exists learning_path_progress_unit_number_check;
alter table public.learning_path_progress
  add constraint learning_path_progress_step_number_check
  check (step_number between 1 and 48);
alter table public.learning_path_progress
  add constraint learning_path_progress_unit_number_check
  check (unit_number between 1 and 8);

create or replace function public.record_word_learning_activity(
  p_word_id text,
  p_unit_number smallint,
  p_correct boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date;
  v_mastery smallint;
  v_next_review timestamptz;
  v_xp integer := case when p_correct then 10 else 2 end;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_word_id !~ '^word-[0-9]{3,5}$' then
    raise exception 'Invalid word identifier' using errcode = '22023';
  end if;
  if p_unit_number not between 1 and 8 then
    raise exception 'Invalid learning unit' using errcode = '22023';
  end if;

  select mastery_level into v_mastery
  from public.word_memory
  where user_id = v_user_id and word_id = p_word_id;

  v_mastery := least(
    5,
    greatest(0, coalesce(v_mastery, 0) + case when p_correct then 1 else -1 end)
  );
  v_next_review := case
    when not p_correct then now() + interval '4 hours'
    else now() + make_interval(
      days => (array[1, 3, 7, 14, 30])[greatest(1, v_mastery)]
    )
  end;

  insert into public.word_memory (
    user_id, word_id, unit_number, times_practiced, correct_answers,
    mistake_count, mastery_level, last_result, last_reviewed_at, next_review_at
  ) values (
    v_user_id, p_word_id, p_unit_number, 1,
    case when p_correct then 1 else 0 end,
    case when p_correct then 0 else 1 end,
    v_mastery, p_correct, now(), v_next_review
  )
  on conflict (user_id, word_id) do update
  set unit_number = excluded.unit_number,
      times_practiced = public.word_memory.times_practiced + 1,
      correct_answers = public.word_memory.correct_answers
        + case when p_correct then 1 else 0 end,
      mistake_count = public.word_memory.mistake_count
        + case when p_correct then 0 else 1 end,
      mastery_level = v_mastery,
      last_result = p_correct,
      last_reviewed_at = now(),
      next_review_at = v_next_review;

  select (now() at time zone p.timezone)::date
  into v_today
  from public.profiles p
  where p.id = v_user_id;
  v_today := coalesce(v_today, (now() at time zone 'Asia/Tbilisi')::date);

  insert into public.daily_activity (
    user_id, activity_date, phrases_practiced, correct_answers, xp_earned
  ) values (
    v_user_id, v_today, 1, case when p_correct then 1 else 0 end, v_xp
  )
  on conflict (user_id, activity_date) do update
  set phrases_practiced = public.daily_activity.phrases_practiced + 1,
      correct_answers = public.daily_activity.correct_answers
        + case when p_correct then 1 else 0 end,
      xp_earned = public.daily_activity.xp_earned + v_xp;

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
end;
$$;

revoke all on function public.record_word_learning_activity(text, smallint, boolean)
from public, anon;
grant execute on function public.record_word_learning_activity(text, smallint, boolean)
to authenticated;
