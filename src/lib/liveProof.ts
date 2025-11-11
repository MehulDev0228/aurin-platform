// LiveProof™ check-in system for AURIN v1
// QR + selfie + geo verification

import { supabase } from './supabase';
import { logger } from './logger';

export interface LiveProofCheckIn {
  eventId: string;
  photoUrl: string;
  lat: number;
  lng: number;
  deviceFingerprint: string;
}

export interface QRPayload {
  event_id: string;
  nonce: string;
  exp: number;
}

/**
 * Generate QR code JWT for event check-in
 */
export async function generateCheckInQR(eventId: string): Promise<string> {
  try {
    // In production, this would use a JWT library
    // For now, return a simple token
    const payload: QRPayload = {
      event_id: eventId,
      nonce: Math.random().toString(36).substring(7),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    // In production, sign with secret key
    return btoa(JSON.stringify(payload));
  } catch (error) {
    logger.error('Failed to generate QR code', { error, context: 'LiveProof', eventId });
    throw error;
  }
}

/**
 * Verify QR code payload
 */
export function verifyQRPayload(token: string): QRPayload | null {
  try {
    const payload = JSON.parse(atob(token)) as QRPayload;
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Create check-in record with LiveProof data
 */
export async function createCheckIn(data: LiveProofCheckIn): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: checkin, error } = await supabase
      .from('checkins')
      .insert({
        event_id: data.eventId,
        user_id: user.id,
        photo_url: data.photoUrl,
        lat: data.lat,
        lng: data.lng,
        device_fingerprint: data.deviceFingerprint,
        verified: false, // Will be verified by organizer or admin
      })
      .select('id')
      .single();

    if (error) throw error;
    return checkin.id;
  } catch (error) {
    logger.error('Failed to create check-in', { error, context: 'LiveProof', data });
    throw error;
  }
}

/**
 * Verify check-in (organizer or admin)
 */
export async function verifyCheckIn(checkinId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('checkins')
      .update({ verified: true })
      .eq('id', checkinId);

    if (error) throw error;
  } catch (error) {
    logger.error('Failed to verify check-in', { error, context: 'LiveProof', checkinId });
    throw error;
  }
}

/**
 * Get device fingerprint (simple hash)
 */
export function getDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('AURIN', 2, 2);
  const fingerprint = canvas.toDataURL();
  
  // Combine with user agent and screen resolution
  const combined = `${fingerprint}-${navigator.userAgent}-${screen.width}x${screen.height}`;
  
  // Simple hash (in production, use crypto.subtle)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

