-- 1) Add wallet and role to profiles
alter table public.profiles
  add column if not exists wallet_address text,
  add column if not exists role text default 'user' check (role in ('user','organizer','admin'));

create unique index if not exists profiles_wallet_address_unique on public.profiles (wallet_address) where wallet_address is not null;

-- 2) Achievements policy: self insert + organizer/admin insert
drop policy if exists achievements_self_insert on public.achievements;
drop policy if exists achievements_admin_insert on public.achievements;

create policy achievements_self_insert on public.achievements
for insert to authenticated
with check ( auth.uid() = user_id );

create policy achievements_admin_insert on public.achievements
for insert to authenticated
with check (
  exists ( select 1 from public.profiles p where p.id = auth.uid() and p.role in ('organizer','admin') )
);

-- 3) Read policy (adjust to your needs)
drop policy if exists achievements_read_public on public.achievements;
create policy achievements_read_public on public.achievements
for select to authenticated using ( true );

-- 4) Allow user to update own profile (wallet etc.)
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update to authenticated
using ( id = auth.uid() )
with check ( id = auth.uid() );

-- 5) Admin/organizer manage badges
drop policy if exists badges_admin_all on public.badges;
create policy badges_admin_all on public.badges
for all to authenticated
using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('organizer','admin')) )
with check ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('organizer','admin')) );
