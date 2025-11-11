# 🚀 AURIN Setup Guide

Complete guide to set up and run the AURIN platform locally or in production.

---

## 📋 Prerequisites

- **Node.js**: v18+ (recommended: v20)
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Supabase Account**: Free tier works
- **MetaMask** or **WalletConnect**: For blockchain testing
- **Base Mainnet Wallet**: For production (or Sepolia for testing)

---

## 🛠️ Step-by-Step Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd aurin-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

**Key Dependencies:**
- `react` + `react-dom`: UI framework
- `@supabase/supabase-js`: Backend client
- `ethers@^5.7.2`: Blockchain interaction
- `framer-motion`: Animations
- `react-router-dom`: Routing
- `zod`: Validation
- `react-hook-form`: Form handling

### Step 3: Set Up Supabase

#### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

#### 3.2 Run Database Migrations

**Important**: Run migrations in order!

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

**Or manually in Supabase SQL Editor:**

1. Go to Supabase Dashboard → SQL Editor
2. Run migrations in this order:
   - `20251101115231_create_aurin_core_schema.sql`
   - `20251106072019_add_missing_tables_and_data.sql`
   - `20251106073326_create_events_system.sql`
   - `20251106074318_add_email_verification_and_wallet.sql`
   - `20251106101927_create_admin_system.sql`
   - `20251106133906_fix_admin_users_rls_infinite_recursion.sql`
   - `20251106133942_add_auto_profile_creation_trigger.sql`
   - `20251107_launch.sql`
   - `20251107_hardening.sql`
   - `20251107_extras.sql`
   - `20251107_launch_finish.sql`
   - `20251108_add_username_unique_constraint.sql`
   - `20251108_seed_data.sql`

#### 3.3 Configure Supabase Auth

1. Go to **Authentication → Settings**
2. **Site URL**: `http://localhost:5173` (development) or your production URL
3. **Redirect URLs**: Add your URLs
4. **Email Auth**: Enable email/password
5. **Email Templates**: Customize if needed

#### 3.4 Set Up Storage

1. Go to **Storage**
2. Create bucket: `avatars`
3. Set policies:
   - **Public read**: `SELECT` for `authenticated, anon`
   - **Authenticated upload**: `INSERT, UPDATE` for `authenticated`

### Step 4: Configure Environment Variables

Create `.env.local` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Blockchain (Optional - set to disable)
VITE_BLOCKCHAIN_ENABLED=true
VITE_CHAIN_ID=8453
VITE_CONTRACT_ADDRESS=your-contract-address
VITE_CONTRACT_STANDARD=ERC-721

# Email Service (Optional - for custom emails)
VITE_EMAIL_SERVICE_URL=https://your-project.supabase.co/functions/v1/send-email
```

**Get Supabase Credentials:**
1. Go to Supabase Dashboard → Settings → API
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Step 5: Set Up Admin User

After creating your account:

1. Go to Supabase Dashboard → SQL Editor
2. Run:

```sql
-- Find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Make yourself admin (replace UUID)
INSERT INTO admin_users (user_id, role, permissions)
VALUES (
  'your-user-id-here',
  'super_admin',
  '{"users": true, "events": true, "badges": true, "analytics": true, "admin_users": true}'::jsonb
);
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔧 Blockchain Setup (Optional)

### For Testing (Sepolia Testnet)

1. **Update `.env.local`:**
```env
VITE_CHAIN_ID=11155111  # Sepolia
VITE_CONTRACT_ADDRESS=your-sepolia-contract
```

2. **Get Test ETH:**
   - Use [Sepolia Faucet](https://sepoliafaucet.com/)

### For Production (Base Mainnet)

1. **Deploy Smart Contract:**
   - Use Remix, Hardhat, or Foundry
   - Deploy ERC-721 or ERC-1155 contract
   - Note contract address

2. **Update `.env.local`:**
```env
VITE_CHAIN_ID=8453  # Base Mainnet
VITE_CONTRACT_ADDRESS=your-contract-address
```

3. **Fund Wallet:**
   - Bridge ETH to Base Mainnet
   - Ensure wallet has ETH for gas fees

### Disable Blockchain (Off-chain Only)

```env
VITE_BLOCKCHAIN_ENABLED=false
```

Badges will be stored in database only (no NFTs).

---

## 📧 Custom Email Setup (Optional)

### Option 1: Use Resend (Recommended)

1. **Sign up**: [resend.com](https://resend.com)
2. **Get API Key**: Dashboard → API Keys
3. **Deploy Edge Function:**
```bash
supabase functions deploy send-email
supabase secrets set RESEND_API_KEY=your-api-key
```

4. **Update AuthContext** to use custom email service

### Option 2: Use Gmail SMTP

1. **Get App Password:**
   - Google Account → Security → 2-Step Verification
   - App Passwords → Generate for "Mail"

2. **Set Secrets:**
```bash
supabase secrets set GMAIL_USER=your-email@gmail.com
supabase secrets set GMAIL_PASS=your-app-password
```

### Option 3: Use Supabase Default

No setup needed - Supabase handles emails automatically.

---

## 🏗️ Build for Production

### Build

```bash
npm run build
```

Output: `dist/` directory

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.local`

### Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Deploy:**
```bash
netlify deploy --prod
```

3. **Set Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables

---

## 🧪 Testing

### Test User Flow

1. **Signup**: Create account at `/signup`
2. **Email Verification**: Check email, verify
3. **Wallet Connection**: Connect MetaMask at `/wallet`
4. **Onboarding**: Complete profile at `/onboarding`
5. **Dashboard**: Access dashboard at `/dashboard`

### Test Organizer Flow

1. **Become Organizer**: Go to `/organizer`, create profile
2. **Create Event**: Go to `/create-event`
3. **Admin Verification**: Login as admin, verify event
4. **Enroll**: Login as user, enroll in event
5. **Issue Badge**: As organizer, issue badge to attendee

### Test Admin Flow

1. **Admin Login**: Go to `/admin-login`
2. **Verify Organizer**: Approve organizer profile
3. **Verify Event**: Approve event
4. **Create Badge**: Create new badge
5. **Award Badge**: Award badge to user

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"

**Solution:**
- Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Verify Supabase project is active
- Check network connection

### Issue: "Wallet connection fails"

**Solution:**
- Install MetaMask extension
- Ensure MetaMask is unlocked
- Check network matches `VITE_CHAIN_ID`
- Verify contract address is correct

### Issue: "Email verification not working"

**Solution:**
- Check Supabase Auth settings
- Verify redirect URLs are configured
- Check email spam folder
- Use custom email service if needed

### Issue: "RLS policy errors"

**Solution:**
- Verify migrations ran successfully
- Check RLS policies in Supabase Dashboard
- Ensure user is authenticated
- Check user has correct role/permissions

### Issue: "Build fails"

**Solution:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v18+)
- Clear build cache: `rm -rf dist .vite`

---

## 📚 Additional Resources

### Documentation
- **AURIN Complete Documentation**: `AURIN_COMPLETE_DOCUMENTATION.md`
- **Admin Access Guide**: `ADMIN_ACCESS_GUIDE.md`
- **Custom Email Setup**: `CUSTOM_EMAIL_SETUP.md`

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

### Blockchain
- [Ethers.js Docs](https://docs.ethers.io/v5/)
- [Base Network](https://base.org/)
- [MetaMask Docs](https://docs.metamask.io/)

---

## ✅ Checklist

Before going live:

- [ ] All migrations run successfully
- [ ] Environment variables configured
- [ ] Admin user created
- [ ] Supabase Auth configured
- [ ] Storage bucket created
- [ ] Blockchain contract deployed (if using)
- [ ] Email service configured (optional)
- [ ] Tested user signup flow
- [ ] Tested organizer flow
- [ ] Tested admin flow
- [ ] Tested badge issuance
- [ ] Production build successful
- [ ] Deployed to hosting platform
- [ ] Environment variables set in production
- [ ] Domain configured
- [ ] SSL certificate active

---

## 🆘 Support

If you encounter issues:

1. Check **Troubleshooting** section above
2. Review **AURIN_COMPLETE_DOCUMENTATION.md**
3. Check Supabase logs in Dashboard
4. Check browser console for errors
5. Verify all environment variables are set

---

**Last Updated**: 2025-11-10  
**Version**: 1.0.0

