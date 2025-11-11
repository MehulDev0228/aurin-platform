// Edge Function: LiveProof Start - Generate QR Token
// POST /edge/liveproof/start

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QRPayload {
  event_id: string;
  nonce: string;
  exp: number;
}

function signJWT(payload: QRPayload, secret: string): string {
  // Simple JWT encoding (in production, use proper JWT library)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(secret + body); // Simplified
  return `${header}.${body}.${signature}`;
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

    const { event_id } = await req.json();

    // Verify user is organizer for this event
    const { data: event } = await supabaseClient
      .from('events')
      .select('organizer_id')
      .eq('id', event_id)
      .single();

    if (!event || event.organizer_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Not authorized for this event' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate QR token (JWT)
    const nonce = crypto.randomUUID();
    const exp = Date.now() + 5 * 60 * 1000; // 5 minutes
    const payload: QRPayload = { event_id, nonce, exp };
    const secret = Deno.env.get('JWT_SECRET') || 'default-secret-change-in-production';
    const qr_token = signJWT(payload, secret);

    return new Response(
      JSON.stringify({
        success: true,
        qr_token,
        exp: 300, // 5 minutes in seconds
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

