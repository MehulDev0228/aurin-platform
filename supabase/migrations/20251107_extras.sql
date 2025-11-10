-- Wallet signature columns to verify ownership
alter table public.profiles
  add column if not exists wallet_signature text,
  add column if not exists wallet_sig_message text;

-- Basic rate limiting: organizers creating too many events per hour
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='events' and policyname='rate_limit_events'
  ) then
    create policy rate_limit_events
    on public.events
    for insert
    to authenticated
    with check (
      (
        select count(*) from public.events
        where organizer_id = auth.uid()
          and created_at > now() - interval '1 hour'
      ) < 10
    );
  end if;
end $$;

-- Optional: prevent enrollment spam (10 per hour)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='enrollments' and policyname='rate_limit_enrollments'
  ) then
    create policy rate_limit_enrollments
    on public.enrollments
    for insert
    to authenticated
    with check (
      (
        select count(*) from public.enrollments
        where user_id = auth.uid()
          and created_at > now() - interval '1 hour'
      ) < 10
    );
  end if;
end $$;
