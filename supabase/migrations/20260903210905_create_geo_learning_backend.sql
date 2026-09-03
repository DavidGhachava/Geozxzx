create schema if not exists private;

create table public.phrase_categories (
  slug text primary key,
  name text not null unique,
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.phrases (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references public.phrase_categories(slug) on update cascade on delete restrict,
  georgian text not null,
  transliteration text not null,
  english text not null,
  russian text not null,
  audio_url text,
  is_free boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_slug, georgian, english)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 1 and 80),
  preferred_translation text not null default 'english' check (preferred_translation in ('english', 'russian')),
  timezone text not null default 'Asia/Tbilisi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_phrases (
  user_id uuid not null references auth.users(id) on delete cascade,
  phrase_id uuid not null references public.phrases(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, phrase_id)
);

create table public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  phrase_id uuid not null references public.phrases(id) on delete cascade,
  times_practiced integer not null default 0 check (times_practiced >= 0),
  correct_answers integer not null default 0 check (correct_answers >= 0 and correct_answers <= times_practiced),
  mastery_level smallint not null default 0 check (mastery_level between 0 and 5),
  last_practiced_at timestamptz,
  next_review_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, phrase_id)
);

create table public.daily_activity (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  phrases_practiced integer not null default 0 check (phrases_practiced >= 0),
  lessons_completed integer not null default 0 check (lessons_completed >= 0),
  correct_answers integer not null default 0 check (correct_answers >= 0),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  minutes_spent integer not null default 0 check (minutes_spent >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, activity_date)
);

create table public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= current_streak),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create index phrases_category_sort_idx on public.phrases (category_slug, sort_order);
create index phrases_search_idx on public.phrases using gin (
  to_tsvector('simple', georgian || ' ' || transliteration || ' ' || english || ' ' || russian)
);
create index saved_phrases_user_created_idx on public.saved_phrases (user_id, created_at desc);
create index learning_progress_user_review_idx on public.learning_progress (user_id, next_review_at);
create index daily_activity_user_date_idx on public.daily_activity (user_id, activity_date desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger phrase_categories_set_updated_at before update on public.phrase_categories
for each row execute function private.set_updated_at();
create trigger phrases_set_updated_at before update on public.phrases
for each row execute function private.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger learning_progress_set_updated_at before update on public.learning_progress
for each row execute function private.set_updated_at();
create trigger daily_activity_set_updated_at before update on public.daily_activity
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(left(coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', ''), 80), '')
  )
  on conflict (id) do nothing;

  insert into public.streaks (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function public.record_learning_activity(
  p_phrase_id uuid,
  p_correct boolean default true,
  p_lesson_completed boolean default false,
  p_minutes integer default 1
)
returns table (
  current_streak integer,
  longest_streak integer,
  total_xp bigint
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date;
  v_xp integer := case when p_correct then 10 else 2 end;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_minutes < 0 or p_minutes > 60 then
    raise exception 'Minutes must be between 0 and 60' using errcode = '22023';
  end if;

  if not exists (select 1 from public.phrases where id = p_phrase_id) then
    raise exception 'Phrase not found' using errcode = '22023';
  end if;

  select (now() at time zone p.timezone)::date
  into v_today
  from public.profiles p
  where p.id = v_user_id;

  v_today := coalesce(v_today, (now() at time zone 'Asia/Tbilisi')::date);

  insert into public.learning_progress (
    user_id, phrase_id, times_practiced, correct_answers, mastery_level,
    last_practiced_at, next_review_at
  )
  values (
    v_user_id, p_phrase_id, 1, case when p_correct then 1 else 0 end,
    case when p_correct then 1 else 0 end, now(),
    now() + case when p_correct then interval '1 day' else interval '4 hours' end
  )
  on conflict (user_id, phrase_id) do update
  set times_practiced = public.learning_progress.times_practiced + 1,
      correct_answers = public.learning_progress.correct_answers + case when p_correct then 1 else 0 end,
      mastery_level = least(5, greatest(0, public.learning_progress.mastery_level + case when p_correct then 1 else -1 end)),
      last_practiced_at = now(),
      next_review_at = now() + case
        when p_correct then make_interval(days => (1 << least(5, public.learning_progress.mastery_level))::integer)
        else interval '4 hours'
      end;

  insert into public.daily_activity (
    user_id, activity_date, phrases_practiced, lessons_completed,
    correct_answers, xp_earned, minutes_spent
  )
  values (
    v_user_id, v_today, 1, case when p_lesson_completed then 1 else 0 end,
    case when p_correct then 1 else 0 end, v_xp, p_minutes
  )
  on conflict (user_id, activity_date) do update
  set phrases_practiced = public.daily_activity.phrases_practiced + 1,
      lessons_completed = public.daily_activity.lessons_completed + case when p_lesson_completed then 1 else 0 end,
      correct_answers = public.daily_activity.correct_answers + case when p_correct then 1 else 0 end,
      xp_earned = public.daily_activity.xp_earned + v_xp,
      minutes_spent = public.daily_activity.minutes_spent + p_minutes;

  insert into public.streaks (user_id, current_streak, longest_streak, last_activity_date)
  values (v_user_id, 1, 1, v_today)
  on conflict (user_id) do update
  set current_streak = case
        when public.streaks.last_activity_date = v_today then public.streaks.current_streak
        when public.streaks.last_activity_date = v_today - 1 then public.streaks.current_streak + 1
        else 1
      end,
      longest_streak = greatest(
        public.streaks.longest_streak,
        case
          when public.streaks.last_activity_date = v_today then public.streaks.current_streak
          when public.streaks.last_activity_date = v_today - 1 then public.streaks.current_streak + 1
          else 1
        end
      ),
      last_activity_date = v_today,
      updated_at = now();

  return query
  select s.current_streak, s.longest_streak,
         coalesce((select sum(d.xp_earned) from public.daily_activity d where d.user_id = v_user_id), 0)::bigint
  from public.streaks s
  where s.user_id = v_user_id;
end;
$$;

alter table public.phrase_categories enable row level security;
alter table public.phrases enable row level security;
alter table public.profiles enable row level security;
alter table public.saved_phrases enable row level security;
alter table public.learning_progress enable row level security;
alter table public.daily_activity enable row level security;
alter table public.streaks enable row level security;

create policy "Phrase categories are publicly readable"
on public.phrase_categories for select to anon, authenticated using (true);
create policy "Phrases are publicly readable"
on public.phrases for select to anon, authenticated using (true);

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "Users can create their own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);
create policy "Users can update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can read their saved phrases"
on public.saved_phrases for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users can save phrases for themselves"
on public.saved_phrases for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Users can remove their saved phrases"
on public.saved_phrases for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read their learning progress"
on public.learning_progress for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users can read their daily activity"
on public.daily_activity for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users can read their streak"
on public.streaks for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.phrase_categories, public.phrases, public.profiles,
  public.saved_phrases, public.learning_progress, public.daily_activity, public.streaks
from anon, authenticated;

grant select on table public.phrase_categories, public.phrases to anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, delete on table public.saved_phrases to authenticated;
grant select on table public.learning_progress, public.daily_activity, public.streaks to authenticated;

revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function public.record_learning_activity(uuid, boolean, boolean, integer) from public, anon;
grant execute on function public.record_learning_activity(uuid, boolean, boolean, integer) to authenticated;

insert into public.phrase_categories (slug, name, description, sort_order) values
  ('essentials', 'Essentials', 'Everyday words for polite, useful conversations.', 1),
  ('food-cafes', 'Food & Cafés', 'Order, ask questions, and enjoy Georgian hospitality.', 2),
  ('transport', 'Transport', 'Get around by bus, taxi, train, and marshrutka.', 3),
  ('shopping', 'Shopping', 'Ask about prices, sizes, and payment.', 4),
  ('emergencies', 'Emergencies', 'Get help quickly when it matters.', 5),
  ('meeting-people', 'Meeting People', 'Introduce yourself and make a connection.', 6);

insert into public.phrases (category_slug, georgian, transliteration, english, russian, sort_order) values
  ('essentials', 'გამარჯობა', 'gamarjoba', 'Hello', 'Привет', 1),
  ('essentials', 'მადლობა', 'madloba', 'Thank you', 'Спасибо', 2),
  ('essentials', 'ნახვამდის', 'nakhvamdis', 'Goodbye', 'До свидания', 3),
  ('essentials', 'გთხოვთ', 'gtkhovt', 'Please', 'Пожалуйста', 4),
  ('essentials', 'დიახ', 'diakh', 'Yes', 'Да', 5),
  ('essentials', 'არა', 'ara', 'No', 'Нет', 6),
  ('food-cafes', 'ერთი ყავა, გთხოვთ', 'erti qava, gtkhovt', 'One coffee, please', 'Один кофе, пожалуйста', 1),
  ('food-cafes', 'მენიუ შეიძლება?', 'meniu sheidzleba?', 'May I see the menu?', 'Можно меню?', 2),
  ('food-cafes', 'უგემრიელესია', 'ugemrielesia', 'It is delicious', 'Это очень вкусно', 3),
  ('transport', 'ბათუმამდე, გთხოვთ', 'batumamde, gtkhovt', 'To Batumi, please', 'До Батуми, пожалуйста', 1),
  ('transport', 'რა ღირს ბილეთი?', 'ra ghirs bileti?', 'How much is the ticket?', 'Сколько стоит билет?', 2),
  ('transport', 'აქ გააჩერეთ', 'ak gaacheret', 'Stop here', 'Остановите здесь', 3),
  ('shopping', 'რა ღირს?', 'ra ghirs?', 'How much is it?', 'Сколько это стоит?', 1),
  ('shopping', 'ბარათით შეიძლება?', 'baratit sheidzleba?', 'Can I pay by card?', 'Можно оплатить картой?', 2),
  ('emergencies', 'დამეხმარეთ!', 'damekhmaret!', 'Help me!', 'Помогите!', 1),
  ('emergencies', 'ექიმი მჭირდება', 'ekimi mchirdeba', 'I need a doctor', 'Мне нужен врач', 2),
  ('meeting-people', 'რა გქვიათ?', 'ra gkviat?', 'What is your name?', 'Как вас зовут?', 1),
  ('meeting-people', 'სასიამოვნოა', 'sasiamovnoa', 'Nice to meet you', 'Приятно познакомиться', 2);
