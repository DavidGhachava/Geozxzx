create table public.product_entitlements (
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null check (product in ('phrasebook_pro')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  source_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, product),
  check (expires_at is null or expires_at > granted_at)
);

create trigger product_entitlements_set_updated_at
before update on public.product_entitlements
for each row execute function private.set_updated_at();

alter table public.product_entitlements enable row level security;

create policy "Users can read their own product entitlements"
on public.product_entitlements for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.product_entitlements from anon, authenticated;
grant select on table public.product_entitlements to anon, authenticated;
grant select, insert, update, delete on table public.product_entitlements to service_role;

create function public.has_phrasebook_pro_access()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    (select e.status = 'active'
      and (e.expires_at is null or e.expires_at > now())
     from public.product_entitlements e
     where e.user_id = auth.uid()
       and e.product = 'phrasebook_pro'),
    false
  );
$$;

revoke all on function public.has_phrasebook_pro_access() from public;
grant execute on function public.has_phrasebook_pro_access() to anon, authenticated;

drop policy "Published free or subscribed phrases are readable" on public.phrases;
create policy "Published free or Phrasebook Pro phrases are readable"
on public.phrases for select to anon, authenticated
using (
  publication_status = 'published'
  and (is_free or (select public.has_phrasebook_pro_access()))
);
