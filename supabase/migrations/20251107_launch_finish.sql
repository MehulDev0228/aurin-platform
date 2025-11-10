-- === AURIN Launch Finish — schema alignment ===

-- 1) Enrollments table (if you don’t already have one)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  status text not null default 'enrolled' check (status in ('enrolled','waitlist','cancelled','attended')),
  attended boolean not null default false,
  created_at timestamptz not null default now()
);

-- uniqueness: a user enrolls once per event
do $$
begin
  if not exists (
    select 1 from pg_indexes where schemaname='public' and tablename='enrollments' and indexname='enrollments_unique'
  ) then
    alter table public.enrollments add constraint enrollments_unique unique (user_id, event_id);
  end if;
end$$;

create index if not exists idx_enrollments_user on public.enrollments (user_id);
create index if not exists idx_enrollments_event on public.enrollments (event_id);

-- RLS (simple, users can read their own; organizers/admin can read all)
alter table public.enrollments enable row level security;

drop policy if exists enrollments_user_read on public.enrollments;
create policy enrollments_user_read on public.enrollments
for select to authenticated
using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('organizer','admin'))
);

drop policy if exists enrollments_user_insert on public.enrollments;
create policy enrollments_user_insert on public.enrollments
for insert to authenticated
with check ( user_id = auth.uid() );

-- Optional organizer/admin management
drop policy if exists enrollments_admin_all on public.enrollments;
create policy enrollments_admin_all on public.enrollments
for all to authenticated
using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('organizer','admin')) )
with check ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('organizer','admin')) );

-- 2) Events.category (lightweight filtering chip)
alter table public.events
  add column if not exists category text;

create index if not exists idx_events_category on public.events (category);
create index if not exists idx_events_public_start on public.events (is_public, start_at desc);

-- 3) Wallet ownership proof on profiles
alter table public.profiles
  add column if not exists wallet_signature text,
  add column if not exists wallet_sig_message text;

create index if not exists idx_profiles_wallet on public.profiles (wallet_address);
