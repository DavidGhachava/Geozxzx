create table if not exists public.saved_words (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null check (word_id ~ '^word-[0-9]{3,5}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

alter table public.saved_words enable row level security;

drop policy if exists "Users can read their own saved words" on public.saved_words;
create policy "Users can read their own saved words"
on public.saved_words for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can save their own words" on public.saved_words;
create policy "Users can save their own words"
on public.saved_words for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove their own saved words" on public.saved_words;
create policy "Users can remove their own saved words"
on public.saved_words for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.saved_words from public, anon, authenticated;
grant select, insert, delete on table public.saved_words to authenticated;
