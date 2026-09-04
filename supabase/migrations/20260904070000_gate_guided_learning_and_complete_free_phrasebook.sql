create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'guided_learning' check (plan = 'guided_learning'),
  status text not null default 'incomplete' check (status in ('incomplete', 'trialing', 'active', 'past_due', 'canceled', 'expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (current_period_end is null or current_period_start is null or current_period_end > current_period_start)
);

create trigger subscriptions_set_updated_at before update on public.subscriptions
for each row execute function private.set_updated_at();

alter table public.subscriptions enable row level security;

create policy "Users can read their own subscription"
on public.subscriptions for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.subscriptions from anon, authenticated;
grant select on table public.subscriptions to anon, authenticated;
grant select, insert, update, delete on table public.subscriptions to service_role;

create or replace function public.has_guided_learning_access()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    (select s.status in ('trialing', 'active')
      and s.current_period_end is not null
      and s.current_period_end > now()
     from public.subscriptions s
     where s.user_id = auth.uid()
       and s.plan = 'guided_learning'),
    false
  );
$$;

revoke all on function public.has_guided_learning_access() from public;
grant execute on function public.has_guided_learning_access() to anon, authenticated;

drop policy "Phrases are publicly readable" on public.phrases;
create policy "Published free or subscribed phrases are readable"
on public.phrases for select to anon, authenticated
using (
  publication_status = 'published'
  and (is_free or (select public.has_guided_learning_access()))
);

alter function public.record_learning_activity(uuid, boolean, boolean, integer)
rename to record_learning_activity_internal;
alter function public.record_learning_activity_internal(uuid, boolean, boolean, integer)
set schema private;
revoke all on function private.record_learning_activity_internal(uuid, boolean, boolean, integer)
from public, anon, authenticated;

create function public.record_learning_activity(
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
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if not public.has_guided_learning_access() then
    raise exception 'Guided Learning subscription required' using errcode = '42501';
  end if;

  return query
  select *
  from private.record_learning_activity_internal(
    p_phrase_id,
    p_correct,
    p_lesson_completed,
    p_minutes
  );
end;
$$;

revoke all on function public.record_learning_activity(uuid, boolean, boolean, integer)
from public, anon;
grant execute on function public.record_learning_activity(uuid, boolean, boolean, integer)
to authenticated;

insert into public.phrases
  (category_slug, georgian, transliteration, english, russian, is_free, sort_order)
values
  ('essentials', 'ბოდიში', 'bodishi', 'Excuse me / Sorry', 'Извините', true, 7),
  ('essentials', 'დილა მშვიდობისა', 'dila mshvidobisa', 'Good morning', 'Доброе утро', true, 8),
  ('essentials', 'საღამო მშვიდობისა', 'saghamo mshvidobisa', 'Good evening', 'Добрый вечер', true, 9),
  ('essentials', 'არ მესმის', 'ar mesmis', 'I do not understand', 'Я не понимаю', true, 10),
  ('essentials', 'ინგლისურად საუბრობთ?', 'inglisurad saubrobt?', 'Do you speak English?', 'Вы говорите по-английски?', true, 11),
  ('essentials', 'რუსულად საუბრობთ?', 'rusulad saubrobt?', 'Do you speak Russian?', 'Вы говорите по-русски?', true, 12),
  ('essentials', 'შეგიძლიათ გაიმეოროთ?', 'shegidzliat gaimeorot?', 'Can you repeat?', 'Можете повторить?', true, 13),
  ('essentials', 'უფრო ნელა, გთხოვთ', 'upro nela, gtkhovt', 'More slowly, please', 'Помедленнее, пожалуйста', true, 14),
  ('food-cafes', 'წყალი, გთხოვთ', 'tsqali, gtkhovt', 'Water, please', 'Воду, пожалуйста', true, 4),
  ('food-cafes', 'ანგარიში, გთხოვთ', 'angarishi, gtkhovt', 'The bill, please', 'Счёт, пожалуйста', true, 5),
  ('food-cafes', 'ვეგეტარიანული კერძი გაქვთ?', 'vegetarianuli kerzi gakvt?', 'Do you have a vegetarian dish?', 'У вас есть вегетарианское блюдо?', true, 6),
  ('food-cafes', 'უშაქროდ, გთხოვთ', 'ushakrod, gtkhovt', 'Without sugar, please', 'Без сахара, пожалуйста', true, 7),
  ('food-cafes', 'ალერგია მაქვს', 'alergia makvs', 'I have an allergy', 'У меня аллергия', true, 8),
  ('food-cafes', 'ცხარე არ მინდა', 'tskhare ar minda', 'I do not want it spicy', 'Я не хочу острое', true, 9),
  ('transport', 'ავტობუსის გაჩერება სად არის?', 'avtobusis gachereba sad aris?', 'Where is the bus stop?', 'Где автобусная остановка?', true, 4),
  ('transport', 'სადგური სად არის?', 'sadguri sad aris?', 'Where is the station?', 'Где вокзал?', true, 5),
  ('transport', 'აეროპორტში, გთხოვთ', 'aeroportshi, gtkhovt', 'To the airport, please', 'В аэропорт, пожалуйста', true, 6),
  ('transport', 'როდის გადის?', 'rodis gadis?', 'When does it leave?', 'Когда отправляется?', true, 7),
  ('transport', 'ეს ავტობუსი ცენტრში მიდის?', 'es avtobusi tsentrshi midis?', 'Does this bus go to the center?', 'Этот автобус идёт в центр?', true, 8),
  ('transport', 'მარჯვნივ თუ მარცხნივ?', 'marjvniv tu martskhniv?', 'Right or left?', 'Направо или налево?', true, 9),
  ('shopping', 'ეს მინდა', 'es minda', 'I want this', 'Я хочу это', true, 3),
  ('shopping', 'სხვა ზომა გაქვთ?', 'skhva zoma gakvt?', 'Do you have another size?', 'У вас есть другой размер?', true, 4),
  ('shopping', 'ნაღდი ფულით შეიძლება?', 'naghdi pulit sheidzleba?', 'Can I pay in cash?', 'Можно наличными?', true, 5),
  ('shopping', 'ქვითარი, გთხოვთ', 'kvitari, gtkhovt', 'A receipt, please', 'Чек, пожалуйста', true, 6),
  ('shopping', 'ძალიან ძვირია', 'dzalian dzviria', 'It is very expensive', 'Это очень дорого', true, 7),
  ('emergencies', 'პოლიცია გამოიძახეთ', 'politsia gamoidzakhet', 'Call the police', 'Вызовите полицию', true, 3),
  ('emergencies', 'სასწრაფო დახმარება გამოიძახეთ', 'sastsrapo dakhmareba gamoidzakhet', 'Call an ambulance', 'Вызовите скорую помощь', true, 4),
  ('emergencies', 'დავიკარგე', 'davikarge', 'I am lost', 'Я заблудился / заблудилась', true, 5),
  ('emergencies', 'აფთიაქი სად არის?', 'aptiaki sad aris?', 'Where is the pharmacy?', 'Где аптека?', true, 6),
  ('meeting-people', 'მე მქვია…', 'me mkvia…', 'My name is…', 'Меня зовут…', true, 3),
  ('meeting-people', 'საიდან ხართ?', 'saidan khart?', 'Where are you from?', 'Откуда вы?', true, 4),
  ('meeting-people', 'ქართულს ვსწავლობ', 'kartuls vstsavlob', 'I am learning Georgian', 'Я учу грузинский', true, 5)
on conflict (category_slug, georgian, english) do nothing;
