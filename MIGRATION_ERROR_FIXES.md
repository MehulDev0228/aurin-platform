# 🔧 Migration Error Fixes

## ✅ **Fixed: Policy Already Exists Error**

### **Problem:**
When running Migration #4 (`20251106074318_add_email_verification_and_wallet.sql`), you got:
```
ERROR: policy "Users can view own wallet connections" for table "wallet_connections" already exists
```

### **Solution:**
I've updated the migration file to **check if policies exist** before creating them. This makes the migration **idempotent** (safe to run multiple times).

### **What I Fixed:**
- ✅ Added checks for `wallet_connections` policies
- ✅ Added checks for `email_verification_tokens` policies
- ✅ Now uses `DO $$ BEGIN ... END $$;` blocks to check existence first

### **What You Should Do:**

#### **Option 1: Use the Fixed Migration File (Recommended)**
1. The file `20251106074318_add_email_verification_and_wallet.sql` has been updated
2. **Copy the NEW version** from your project folder
3. Paste it into Supabase SQL Editor
4. Run it - it should work now! ✅

#### **Option 2: Skip the Policy Creation (Quick Fix)**
If you want to continue quickly, you can:
1. Open the migration file
2. **Comment out or skip** the policy creation lines (lines 95-109)
3. Run the rest of the migration
4. The policies are already created, so you're good!

### **How to Verify:**
After running the migration, check in Supabase:
1. Go to **Table Editor** → `wallet_connections` table
2. Go to **Authentication** → **Policies**
3. You should see the policies listed

---

## 🎯 **Updated Migration Order (With Fixes)**

```
✅ 1. create_aurin_core_schema.sql
✅ 2. add_missing_tables_and_data.sql
✅ 3. create_events_system.sql
✅ 4. add_email_verification_and_wallet.sql ← FIXED (use updated version)
➡️ 5. create_admin_system.sql (run this next)
➡️ 6. fix_admin_users_rls_infinite_recursion.sql
➡️ 7. add_auto_profile_creation_trigger.sql
⏭️ 8. extras.sql (skip, run after #11)
➡️ 9. hardening.sql
➡️ 10. launch.sql
➡️ 11. launch_finish.sql
✅ 8. extras.sql (run last)
```

---

## 💡 **Pro Tip:**
If you get "already exists" errors, it usually means:
- ✅ The migration partially ran before
- ✅ The object (table/policy/function) is already created
- ✅ You can usually **skip that part** and continue

The updated migration file now handles this automatically! 🎉

