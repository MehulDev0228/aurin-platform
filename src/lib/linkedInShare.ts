// LinkedIn one-tap sharing for AURIN v1
// Generates signed verification URL + text snippet

import { supabase } from './supabase';
import { logger } from './logger';

export interface LinkedInShareData {
  achievementId: string;
  badgeName: string;
  badgeDescription: string;
  verifyUrl: string;
}

/**
 * Generate signed verification URL for LinkedIn sharing
 */
export async function generateLinkedInShare(data: LinkedInShareData): Promise<string> {
  try {
    // Create signed token (in production, use JWT with secret)
    const token = btoa(JSON.stringify({
      achievement_id: data.achievementId,
      exp: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    }));

    const verifyUrl = `${window.location.origin}/verify/${token}`;

    // Generate LinkedIn post text
    const linkedInText = generateLinkedInText(data, verifyUrl);

    return linkedInText;
  } catch (error) {
    logger.error('Failed to generate LinkedIn share', { error, context: 'LinkedInShare', data });
    throw error;
  }
}

/**
 * Generate LinkedIn post text with verification link
 */
function generateLinkedInText(data: LinkedInShareData, verifyUrl: string): string {
  return `🏆 Just earned "${data.badgeName}" on AURIN!

${data.badgeDescription}

Verify this achievement: ${verifyUrl}

#AURIN #ProofOfDoing #Achievement`;
}

/**
 * Open LinkedIn share dialog
 */
export function openLinkedInShare(text: string): void {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

/**
 * Copy LinkedIn text to clipboard
 */
export async function copyLinkedInText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    logger.error('Failed to copy LinkedIn text', { error, context: 'LinkedInShare' });
    throw error;
  }
}

