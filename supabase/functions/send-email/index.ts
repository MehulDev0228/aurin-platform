// supabase/functions/send-email/index.ts
// Supabase Edge Function for sending custom emails via Gmail
// Deploy: supabase functions deploy send-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
// Or use Gmail SMTP with nodemailer (requires different setup)

serve(async (req) => {
  try {
    const { to, subject, html, text } = await req.json();

    // Option 1: Use Resend (recommended for production)
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AURIN <noreply@aurin.com>", // Your verified domain
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!resendResponse.ok) {
      throw new Error("Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});

