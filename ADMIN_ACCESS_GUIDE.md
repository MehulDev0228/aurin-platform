# 🔐 Admin Access Guide

## How to Access Admin Panel

### Step 1: Create Admin User

1. **Sign up as a regular user** first:
   - Go to `/signup`
   - Create your account with your email

2. **Make yourself admin** via Supabase SQL Editor:
   ```sql
   -- Replace 'your-user-id' with your actual user ID from auth.users
   -- You can find it in Supabase Dashboard > Authentication > Users
   
   INSERT INTO admin_users (user_id, role, permissions)
   VALUES (
     'your-user-id-here',
     'super_admin',
     '{"users": true, "events": true, "badges": true, "analytics": true, "admin_users": true}'::jsonb
   );
   ```

### Step 2: Access Admin Panel

1. Go to `/admin-login`
2. Enter your email and password
3. You'll be redirected to `/admin` dashboard

## Admin Routes

- **Admin Login**: `/admin-login`
- **Admin Dashboard**: `/admin`
- **Regular Login**: `/login` (for regular users)

## Admin Roles

- **super_admin**: Full access to everything
- **admin**: Can manage users, events, badges
- **moderator**: Limited access for content moderation

## Quick Setup Script

Run this in Supabase SQL Editor after creating your account:

```sql
-- Find your user ID first
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert admin record (replace the UUID)
INSERT INTO admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  '{"users": true, "events": true, "badges": true, "analytics": true, "admin_users": true}'::jsonb
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO NOTHING;
```

## Security Notes

- Admin access is protected by RLS policies
- Only users in `admin_users` table can access admin routes
- All admin actions are logged in `admin_activity_logs`

