-- Account deletion now runs in an authenticated Edge Function. Keeping the
-- privileged operation outside the exposed database API removes the need for
-- an authenticated SECURITY DEFINER function.
drop function if exists public.delete_own_account();
