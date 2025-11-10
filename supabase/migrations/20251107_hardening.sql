-- Unique, not-null, and indexes for common lookups
alter table public.profiles
  alter column username set not null,
  add constraint profiles_username_unique unique (username);

create index if not exists idx_profiles_username on public.profiles (username);
create index if not exists idx_profiles_wallet on public.profiles (wallet_address);

alter table public.events
  alter column title set not null,
  alter column start_date set not null,
  alter column end_date set not null;

create index if not exists idx_events_status_start on public.events (status, start_date desc);
create index if not exists idx_events_category on public.events (category);

-- Note: enrollments table is created in launch_finish.sql, so skip this if table doesn't exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'enrollments'
  ) THEN
    -- Add constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'enrollments_unique'
    ) THEN
      ALTER TABLE public.enrollments
        ADD CONSTRAINT enrollments_unique UNIQUE (user_id, event_id);
    END IF;
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments (user_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_event ON public.enrollments (event_id);
  END IF;
END $$;

-- Keep achievements sane
create index if not exists idx_achievements_user on public.achievements (user_id);
create index if not exists idx_achievements_badge on public.achievements (badge_id);
