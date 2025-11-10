-- Unique, not-null, and indexes for common lookups
alter table public.profiles
  alter column username set not null,
  add constraint profiles_username_unique unique (username);

create index if not exists idx_profiles_username on public.profiles (username);
create index if not exists idx_profiles_wallet on public.profiles (wallet_address);

alter table public.events
  alter column name set not null,
  alter column start_at set not null,
  alter column end_at set not null;

create index if not exists idx_events_public_start on public.events (is_public, start_at desc);
create index if not exists idx_events_category on public.events (category);

alter table public.enrollments
  add constraint enrollments_unique unique (user_id, event_id);

create index if not exists idx_enrollments_user on public.enrollments (user_id);
create index if not exists idx_enrollments_event on public.enrollments (event_id);

-- Keep achievements sane
create index if not exists idx_achievements_user on public.achievements (user_id);
create index if not exists idx_achievements_badge on public.achievements (badge_id);
