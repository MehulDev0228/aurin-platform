// src/lib/emailService.ts - Custom Email Service using Gmail
// This will be called from a Supabase Edge Function or API route

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Email templates
export const emailTemplates = {
  verification: (email: string, verificationLink: string) => ({
    subject: 'Verify your AURIN account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your AURIN Account</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #000000; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <span style="font-size: 20px; color: #000000; font-weight: 700;">A</span>
              </div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #ffffff 0%, #10B981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              AURIN
            </h1>
          </div>

          <!-- Content -->
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">Verify Your Email</h2>
            <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #9CA3AF;">
              Welcome to AURIN! Please verify your email address to unlock your dashboard and start earning verifiable badges.
            </p>
            
            <a href="${verificationLink}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #000000; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; text-align: center; margin: 20px 0;">
              Verify Email Address
            </a>

            <p style="margin: 30px 0 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationLink}" style="color: #10B981; word-break: break-all;">${verificationLink}</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="margin: 0; font-size: 12px; color: #6B7280;">
              This email was sent to ${email}. If you didn't create an AURIN account, you can safely ignore this email.
            </p>
            <p style="margin: 20px 0 0 0; font-size: 12px; color: #6B7280;">
              © ${new Date().getFullYear()} AURIN. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to AURIN! Please verify your email address by clicking this link: ${verificationLink}`
  }),

  welcome: (name: string) => ({
    subject: 'Welcome to AURIN!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AURIN</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #000000; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <span style="font-size: 20px; color: #000000; font-weight: 700;">A</span>
              </div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #ffffff 0%, #10B981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              Welcome to AURIN!
            </h1>
          </div>

          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px;">
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">Hi ${name},</h2>
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #9CA3AF;">
              Your account has been verified! You're now ready to start building your digital legacy on AURIN.
            </p>
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #9CA3AF;">
              Complete your profile setup and connect your wallet to start earning verifiable badges.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Note: This function should be called from a Supabase Edge Function
// For now, we'll use Supabase's built-in email, but you can replace it with Nodemailer
export async function sendEmail(options: EmailOptions): Promise<void> {
  // TODO: Implement with Supabase Edge Function or API route
  // This will use your Gmail credentials
  // In development, log email details; in production, send via service
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('Email would be sent:', options);
  }
  
  // For now, use Supabase's email service
  // In production, replace with your custom email service
}

