# 📚 Step-by-Step: Running Database Migrations in Supabase

## Method 1: Using Supabase Dashboard (Easiest - Recommended)

### Step 1: Open Supabase Dashboard
1. Go to [app.supabase.com](https://app.supabase.com)
2. Log in to your account
3. Select your AURIN project

### Step 2: Open SQL Editor
1. In the left sidebar, click **"SQL Editor"** (icon looks like a database/terminal)
2. You'll see a blank SQL editor window

### Step 3: Run Each Migration File

You need to run **11 migration files** in this exact order:

#### Migration 1: Core Schema
1. Open file: `supabase/migrations/20251101115231_create_aurin_core_schema.sql`
2. Copy **ALL** the contents (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for "Success" message ✅

#### Migration 2: Missing Tables
1. Open file: `supabase/migrations/20251106072019_add_missing_tables_and_data.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 3: Events System
1. Open file: `supabase/migrations/20251106073326_create_events_system.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 4: Email & Wallet
1. Open file: `supabase/migrations/20251106074318_add_email_verification_and_wallet.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 5: Admin System
1. Open file: `supabase/migrations/20251106101927_create_admin_system.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 6: Fix Admin RLS
1. Open file: `supabase/migrations/20251106133906_fix_admin_users_rls_infinite_recursion.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 7: Auto Profile Creation
1. Open file: `supabase/migrations/20251106133942_add_auto_profile_creation_trigger.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 8: Extras
1. Open file: `supabase/migrations/20251107_extras.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 9: Hardening
1. Open file: `supabase/migrations/20251107_hardening.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 10: Launch
1. Open file: `supabase/migrations/20251107_launch.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

#### Migration 11: Launch Finish
1. Open file: `supabase/migrations/20251107_launch_finish.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **"Run"** ✅

### Step 4: Verify Migrations
1. In Supabase dashboard, go to **"Table Editor"** (left sidebar)
2. You should see these tables:
   - ✅ profiles
   - ✅ badges
   - ✅ achievements
   - ✅ events
   - ✅ event_enrollments
   - ✅ organizer_profiles
   - ✅ admin_users
   - ✅ issuers
   - And more...

If you see all tables, **migrations are successful!** 🎉

---

## Method 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

---

## ⚠️ Troubleshooting

### Error: "relation already exists"
- **Solution**: This means the table already exists. You can either:
  - Skip that migration (if it's just creating the table)
  - Or drop the table first: `DROP TABLE IF EXISTS table_name;`

### Error: "permission denied"
- **Solution**: Make sure you're using the SQL Editor (not a restricted user)
- Check that you're logged in as project owner

### Error: "syntax error"
- **Solution**: Make sure you copied the ENTIRE file
- Check for any missing semicolons
- Try running the migration again

### Migration fails partway through
- **Solution**: 
  1. Check the error message
  2. Fix the issue
  3. Re-run that specific migration
  4. Continue with remaining migrations

---

## ✅ After Migrations Complete

### 1. Verify Tables Exist
Go to **Table Editor** → You should see ~15+ tables

### 2. Check RLS Policies
Go to **Authentication** → **Policies** → Verify policies are created

### 3. Test Your App
```bash
npm run dev
```

Try signing up - it should work! 🚀

---

## 🎯 Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Opened SQL Editor
- [ ] Ran Migration 1 (Core Schema)
- [ ] Ran Migration 2 (Missing Tables)
- [ ] Ran Migration 3 (Events System)
- [ ] Ran Migration 4 (Email & Wallet)
- [ ] Ran Migration 5 (Admin System)
- [ ] Ran Migration 6 (Fix Admin RLS)
- [ ] Ran Migration 7 (Auto Profile)
- [ ] Ran Migration 8 (Extras)
- [ ] Ran Migration 9 (Hardening)
- [ ] Ran Migration 10 (Launch)
- [ ] Ran Migration 11 (Launch Finish)
- [ ] Verified tables in Table Editor
- [ ] Tested app signup

---

## 💡 Pro Tip

**Save your SQL queries in Supabase:**
- After running each migration successfully
- Click "Save" button in SQL Editor
- Name it like "Migration 1 - Core Schema"
- This helps you track what's been run

---

## 🆘 Need Help?

If you get stuck:
1. Check the error message in Supabase SQL Editor
2. Look at which migration failed
3. Try running just that migration again
4. Check Supabase logs for more details

Good luck! 🚀

