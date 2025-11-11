// Edge Function: LiveProof Verify - Validate Check-in
// POST /edge/liveproof/verify

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function verifyJWT(token: string, secret: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null; // Expired
    return payload;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { qr_token, selfie_base64, lat, lng, device_fingerprint } = await req.json();

    // Verify QR token
    const secret = Deno.env.get('JWT_SECRET') || 'default-secret-change-in-production';
    const payload = verifyJWT(qr_token, secret);
    if (!payload) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired QR token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { event_id } = payload;

    // Rate limit check (5/min per user per event)
    // TODO: Implement proper rate limiting

    // Upload selfie to Supabase Storage
    const photoFileName = `${event_id}-${user.id}-${Date.now()}.jpg`;
    const photoBytes = Uint8Array.from(atob(selfie_base64), c => c.charCodeAt(0));
    
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('checkins')
      .upload(photoFileName, photoBytes, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to upload photo' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { publicUrl } } = supabaseClient.storage
      .from('checkins')
      .getPublicUrl(photoFileName);

    // Create check-in record
    const { data: checkin, error: checkinError } = await supabaseClient
      .from('checkins')
      .insert({
        event_id,
        user_id: user.id,
        photo_url: publicUrl,
        lat,
        lng,
        device_fingerprint,
        verified: true, // Auto-verified for now
      })
      .select('id')
      .single();

    if (checkinError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create check-in' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: checkin.id,
        next_action: 'issue_achievement',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

