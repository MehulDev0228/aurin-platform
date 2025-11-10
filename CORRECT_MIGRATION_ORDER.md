# ✅ CORRECT Migration Order (Fixed!)

## ⚠️ **The Problem:**
Migration #8 (`20251107_extras.sql`) tries to use `enrollments` table, but that table is created in Migration #11 (`20251107_launch_finish.sql`).

## ✅ **Solution: Run Migrations in This Order**

### **Step 1-7: Run Normally**
1. ✅ Migration 1: `20251101115231_create_aurin_core_schema.sql`
2. ✅ Migration 2: `20251106072019_add_missing_tables_and_data.sql`
3. ✅ Migration 3: `20251106073326_create_events_system.sql` (creates `event_enrollments`)
4. ✅ Migration 4: `20251106074318_add_email_verification_and_wallet.sql`
5. ✅ Migration 5: `20251106101927_create_admin_system.sql`
6. ✅ Migration 6: `20251106133906_fix_admin_users_rls_infinite_recursion.sql`
7. ✅ Migration 7: `20251106133942_add_auto_profile_creation_trigger.sql`

### **Step 8: SKIP Migration 8 for now!**
⏭️ **SKIP**: `20251107_extras.sql` (we'll run this later)

### **Step 9-11: Continue**
8. ✅ Migration 9: `20251107_hardening.sql`
9. ✅ Migration 10: `20251107_launch.sql`
10. ✅ Migration 11: `20251107_launch_finish.sql` (creates `enrollments` table)

### **Step 12: Now Run Migration 8**
11. ✅ Migration 8: `20251107_extras.sql` (now `enrollments` exists!)

---

## 📋 **Correct Order Summary:**

```
1. 20251101115231_create_aurin_core_schema.sql
2. 20251106072019_add_missing_tables_and_data.sql
3. 20251106073326_create_events_system.sql
4. 20251106074318_add_email_verification_and_wallet.sql
5. 20251106101927_create_admin_system.sql
6. 20251106133906_fix_admin_users_rls_infinite_recursion.sql
7. 20251106133942_add_auto_profile_creation_trigger.sql
8. ⏭️ SKIP 20251107_extras.sql (run later)
9. 20251107_hardening.sql
10. 20251107_launch.sql
11. 20251107_launch_finish.sql ← Creates 'enrollments' table
12. ✅ NOW run 20251107_extras.sql
```

---

## 🎯 **What You Should Do Right Now:**

Since you already ran migrations 1-7, and got an error on #8:

1. **Skip migration #8** for now
2. **Run migration #9** (`20251107_hardening.sql`)
3. **Run migration #10** (`20251107_launch.sql`)
4. **Run migration #11** (`20251107_launch_finish.sql`) ← This creates `enrollments`
5. **Then go back and run migration #8** (`20251107_extras.sql`)

---

## ✅ **Quick Checklist:**

- [x] Migration 1 - Done
- [x] Migration 2 - Done
- [x] Migration 3 - Done
- [x] Migration 4 - Done
- [x] Migration 5 - Done
- [x] Migration 6 - Done
- [x] Migration 7 - Done
- [ ] Migration 8 - **SKIP FOR NOW**
- [ ] Migration 9 - Run this next
- [ ] Migration 10 - Then this
- [ ] Migration 11 - Then this (creates enrollments)
- [ ] Migration 8 - **NOW run this last!**

---

## 💡 **Why This Happens:**

- Migration 8 tries to add a policy to `enrollments` table
- But `enrollments` table is created in Migration 11
- So we need to create the table first, then add the policy

This is a common issue when migrations have dependencies!

