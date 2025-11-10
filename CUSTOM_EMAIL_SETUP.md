# 📧 Custom Email Service Setup Guide

## Replace Supabase Default Email with Your Gmail

### Option 1: Using Resend (Recommended - Easiest)

1. **Sign up for Resend**:
   - Go to [resend.com](https://resend.com)
   - Create a free account
   - Verify your domain (or use their test domain)

2. **Get API Key**:
   - Go to API Keys section
   - Create new API key
   - Copy the key

3. **Set up Supabase Edge Function**:
   - The function is already created: `supabase/functions/send-email/index.ts`
   - Deploy it: `supabase functions deploy send-email`
   - Set environment variable:
     ```bash
     supabase secrets set RESEND_API_KEY=your_resend_api_key
     ```

4. **Update AuthContext to use custom email**:
   - Modify `src/contexts/AuthContext.tsx` to call the edge function instead of Supabase default

### Option 2: Using Gmail SMTP (Direct)

1. **Get Gmail App Password**:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate password for "Mail"
   - Copy the 16-character password

2. **Set up Nodemailer in Supabase Edge Function**:
   - Create new function: `supabase/functions/send-gmail/index.ts`
   - Use Nodemailer with Gmail SMTP
   - Set environment variables:
     ```bash
     supabase secrets set GMAIL_USER=your-email@gmail.com
     supabase secrets set GMAIL_PASS=your-app-password
     ```

3. **Update signup flow**:
   - Modify `src/contexts/AuthContext.tsx` to call your edge function

### Option 3: Quick Setup (Use Your Email Address)

**Simplest approach for MVP:**

1. **Disable Supabase email confirmation**:
   - Go to Supabase Dashboard
   - Authentication → Settings → Email Auth
   - Disable "Confirm email"

2. **Send custom email via your service**:
   - Use the email templates in `src/lib/emailTemplates.ts`
   - Call your email service after signup
   - User clicks link → verify in your system → mark as verified

### Implementation Steps

1. **Update AuthContext** (`src/contexts/AuthContext.tsx`):
   ```typescript
   const signUp = async (email: string, password: string, username: string) => {
     // Create user
     const { data, error } = await supabase.auth.signUp({
       email, password,
       options: { 
         data: { username },
         emailRedirectTo: `${window.location.origin}/email-verification`
       },
     });
     
     // Send custom email
     const verificationLink = `${window.location.origin}/email-verification?token=${data.user?.id}`;
     await fetch('/api/send-email', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         to: email,
         subject: 'Verify your AURIN account',
         html: emailTemplates.verification(email, verificationLink).html
       })
     });
   };
   ```

2. **Create API route or Edge Function**:
   - Use the provided `supabase/functions/send-email/index.ts`
   - Or create API route in your backend

3. **Update email verification**:
   - Verify token from your custom email
   - Mark email as verified in database

## Email Templates

Templates are ready in `src/lib/emailService.ts`:
- Verification email
- Welcome email
- Customize as needed

## Testing

1. Test email sending locally
2. Verify email links work
3. Test on production

## Notes

- For MVP, you can use Resend's free tier (100 emails/day)
- For production, verify your domain for better deliverability
- Custom emails look more professional than Supabase default

