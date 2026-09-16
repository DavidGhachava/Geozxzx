-- Persist the one-time access celebration on the account, not the device.
-- Existing grants are seeded so current customers are not congratulated again
-- when this release reaches them.
create table public.access_welcome_acknowledgements (
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null check (product in ('guided_learning', 'phrasebook_pro')),
  acknowledged_at timestamptz not null default now(),
  primary key (user_id, product)
);

alter table public.access_welcome_acknowledgements enable row level security;

create policy "Users can read their own access acknowledgements"
on public.access_welcome_acknowledgements for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own access acknowledgements"
on public.access_welcome_acknowledgements for insert to authenticated
with check ((select auth.uid()) = user_id);

revoke all on table public.access_welcome_acknowledgements
from public, anon, authenticated;
grant select, insert on table public.access_welcome_acknowledgements
to authenticated;
grant select, insert, update, delete on table public.access_welcome_acknowledgements
to service_role;

insert into public.access_welcome_acknowledgements (user_id, product)
select user_id, 'guided_learning'
from public.subscriptions
where status in ('trialing', 'active')
  and current_period_end is not null
  and current_period_end > now()
on conflict do nothing;

insert into public.access_welcome_acknowledgements (user_id, product)
select user_id, 'phrasebook_pro'
from public.product_entitlements
where status = 'active'
  and (expires_at is null or expires_at > now())
on conflict do nothing;

create function public.claim_access_welcomes()
returns table (product text)
language sql
volatile
security invoker
set search_path = ''
as $$
  with available(product) as (
    select 'guided_learning'::text
    where public.has_guided_learning_access()
    union all
    select 'phrasebook_pro'::text
    where public.has_phrasebook_pro_access()
  ), inserted as (
    insert into public.access_welcome_acknowledgements (user_id, product)
    select auth.uid(), available.product
    from available
    where auth.uid() is not null
    on conflict (user_id, product) do nothing
    returning product
  )
  select inserted.product from inserted;
$$;

revoke all on function public.claim_access_welcomes() from public, anon;
grant execute on function public.claim_access_welcomes() to authenticated;
