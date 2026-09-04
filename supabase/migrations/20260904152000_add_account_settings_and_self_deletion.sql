-- Account settings for GEO. Payment-card data is intentionally never stored here.
alter table public.profiles
  add column if not exists phone_number text;

alter table public.profiles
  drop constraint if exists profiles_phone_number_length;

alter table public.profiles
  add constraint profiles_phone_number_length
  check (phone_number is null or char_length(phone_number) <= 30);

comment on column public.profiles.phone_number is
  'Optional contact number supplied by the user. Never use this field for payment data.';

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  requesting_user_id uuid := auth.uid();
begin
  if requesting_user_id is null then
    raise exception 'Authentication required';
  end if;

  delete from auth.users where id = requesting_user_id;

  if not found then
    raise exception 'Account not found';
  end if;
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;

comment on function public.delete_own_account() is
  'Deletes only the currently authenticated user. Related GEO data is removed through foreign-key cascades.';
