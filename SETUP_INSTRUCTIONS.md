# 🚀 AURIN Setup Instructions

## Quick Start (5 Minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in project details
5. Wait for project to be created (~2 minutes)

### Step 2: Get Your Credentials
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 3: Set Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

### Step 4: Run Database Migrations
1. In Supabase dashboard, go to **SQL Editor**
2. Open each migration file from `supabase/migrations/` folder
3. Run them in this order:
   - `20251101115231_create_aurin_core_schema.sql`
   - `20251106072019_add_missing_tables_and_data.sql`
   - `20251106073326_create_events_system.sql`
   - `20251106074318_add_email_verification_and_wallet.sql`
   - `20251106101927_create_admin_system.sql`
   - `20251106133906_fix_admin_users_rls_infinite_recursion.sql`
   - `20251106133942_add_auto_profile_creation_trigger.sql`
   - `20251107_extras.sql`
   - `20251107_hardening.sql`
   - `20251107_launch.sql`
   - `20251107_launch_finish.sql`

**OR** use Supabase CLI (if installed):
```bash
supabase db push
```

### Step 5: Create Your Admin Account
1. Start the app: `npm run dev`
2. Sign up with your email
3. Complete onboarding
4. In Supabase SQL Editor, run:
   ```sql
   -- Get your user ID from auth.users table first
   INSERT INTO admin_users (user_id, role, permissions)
   VALUES (
     'your-user-id-here',
     'super_admin',
     '{"users": true, "events": true, "badges": true, "analytics": true}'::jsonb
   );
   ```

### Step 6: Test Everything
1. ✅ Test signup/login
2. ✅ Test dashboard
3. ✅ Test event creation
4. ✅ Test badge issuance
5. ✅ Test admin panel

## Troubleshooting

### "Missing required env: VITE_SUPABASE_URL"
- Make sure `.env` file exists in root directory
- Check that variables start with `VITE_`
- Restart dev server after adding `.env`

### "relation does not exist"
- Migrations not run yet
- Run all migration files in order

### "permission denied"
- RLS policies are working (good!)
- Make sure you're logged in
- Check if user has correct permissions

### Can't access admin panel
- Make sure you created admin_users entry
- Check that user_id matches your auth.users id

## Next Steps

1. **Deploy Frontend**
   - Vercel: `vercel deploy`
   - Netlify: Connect GitHub repo
   - Add environment variables in deployment platform

2. **Configure Email** (Optional)
   - In Supabase: Settings → Auth → Email Templates
   - Customize verification emails

3. **Set up Blockchain** (Optional)
   - Deploy ERC1155 or ERC721 contract
   - Add contract address to `.env`
   - Test badge minting

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify all migrations ran successfully
4. Ensure environment variables are set correctly

