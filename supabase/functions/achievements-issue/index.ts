// Edge Function: Issue Achievement (with MANDATORY blockchain minting)
// POST /edge/achievements/issue

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { event_id, user_id, badge_id, liveproof_id } = await req.json();

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

    // Get badge and user wallet
    const { data: badge } = await supabaseClient
      .from('badges')
      .select('name, description, image_url')
      .eq('id', badge_id)
      .single();

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('wallet_address')
      .eq('id', user_id)
      .single();

    if (!badge || !profile?.wallet_address) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing badge or wallet address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // MANDATORY: Blockchain minting required
    // Call blockchain minting service (this would be a separate service or contract call)
    // For now, we'll create the achievement and mark it as pending mint
    // In production, this should call the actual minting service

    const { data: achievement, error: achievementError } = await supabaseClient
      .from('achievements')
      .insert({
        user_id,
        badge_id,
        liveproof_id,
        blockchain_verified: false, // Will be updated after mint
        nft_minted: false, // Will be updated after mint
        earned_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (achievementError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create achievement' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Call blockchain minting service here
    // After minting succeeds, update achievement with token_id and tx_hash

    return new Response(
      JSON.stringify({
        success: true,
        id: achievement.id,
        next_action: 'mint_nft', // Client should trigger minting
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

