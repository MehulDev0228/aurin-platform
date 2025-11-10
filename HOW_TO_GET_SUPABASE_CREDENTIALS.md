# 🔑 How to Get Your Supabase Credentials

## 📍 **Step-by-Step Guide:**

### **Step 1: Go to Supabase Dashboard**
1. Open your browser
2. Go to: **https://app.supabase.com**
3. **Log in** to your account

### **Step 2: Select Your Project**
1. You'll see a list of your projects
2. **Click on your AURIN project** (or create a new one if you haven't)

### **Step 3: Get Your Credentials**
1. In the left sidebar, click **"Settings"** (gear icon ⚙️)
2. Click **"API"** (under Project Settings)

### **Step 4: Copy Your Credentials**

You'll see a page with several sections. Look for:

#### **🔗 Project URL:**
- **Location:** Under "Project URL"
- **Looks like:** `https://xxxxxxxxxxxxx.supabase.co`
- **Copy this** → This is your `VITE_SUPABASE_URL`

#### **🔑 anon/public key:**
- **Location:** Under "Project API keys" → **"anon" "public"** key
- **Looks like:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...` (very long string)
- **Copy this** → This is your `VITE_SUPABASE_ANON_KEY`

---

## 📝 **Visual Guide:**

```
Supabase Dashboard
    ↓
Your Project (click it)
    ↓
Left Sidebar → Settings ⚙️
    ↓
API (click it)
    ↓
┌─────────────────────────────────────┐
│ Project URL                         │
│ https://xxxxx.supabase.co  [Copy]   │ ← VITE_SUPABASE_URL
│                                     │
│ Project API keys                    │
│ ┌─────────────────────────────────┐ │
│ │ anon public                     │ │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6... │ │ ← VITE_SUPABASE_ANON_KEY
│ │ [Copy]                          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 📄 **Your .env File Should Look Like:**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk4NzY5MCwiZXhwIjoxOTU0NTYzNjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Blockchain (Optional - leave empty if not using blockchain)
VITE_CONTRACT_ADDRESS=
VITE_CHAIN_ID=0x2105
```

---

## ⚠️ **Important Notes:**

1. **Use "anon" key, NOT "service_role" key**
   - The "anon" key is safe for frontend use
   - The "service_role" key has admin access - NEVER use it in frontend!

2. **Project URL format:**
   - Should start with `https://`
   - Should end with `.supabase.co`
   - Example: `https://abcdefghijklmnop.supabase.co`

3. **API Key format:**
   - Very long string (200+ characters)
   - Starts with `eyJ...`
   - This is a JWT token

---

## 🎯 **Quick Checklist:**

- [ ] Logged into Supabase Dashboard
- [ ] Selected your project
- [ ] Went to Settings → API
- [ ] Copied Project URL
- [ ] Copied anon/public key
- [ ] Pasted both into `.env` file
- [ ] Saved `.env` file

---

## 🆘 **Can't Find It?**

### **If you don't have a project yet:**
1. Click **"New Project"** in Supabase dashboard
2. Fill in:
   - **Name:** AURIN (or any name)
   - **Database Password:** (create a strong password - save it!)
   - **Region:** Choose closest to you
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be created
5. Then follow steps above to get credentials

### **If you see multiple projects:**
- Look for the one you created for AURIN
- Or create a new one specifically for AURIN

---

## ✅ **After Getting Credentials:**

1. **Create `.env` file** in your project root (if not exists)
2. **Add the credentials:**
   ```env
   VITE_SUPABASE_URL=your-url-here
   VITE_SUPABASE_ANON_KEY=your-key-here
   ```
3. **Save the file**
4. **Restart your dev server** if it's running:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

## 🔒 **Security Reminder:**

- ✅ `.env` file is in `.gitignore` (won't be committed to git)
- ✅ Never share your API keys publicly
- ✅ The "anon" key is safe for frontend (it's public by design)
- ❌ Never use "service_role" key in frontend code

---

That's it! Once you have these two values, paste them into your `.env` file and you're ready to go! 🚀

