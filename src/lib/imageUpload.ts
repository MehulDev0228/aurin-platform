// src/lib/imageUpload.ts - Image upload utility for Supabase Storage
import { supabase } from './supabase';
import { logger } from './logger';

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      // If bucket doesn't exist, try to create it or use public URL
      logger.error('Avatar upload failed', { error: uploadError, context: 'ImageUpload' });
      throw new Error('Failed to upload image. Please try again or contact support if the issue persists.');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    logger.error('Image upload error', { error, context: 'ImageUpload' });
    throw new Error(error.message || 'Failed to upload image. Please try again.');
  }
}

export async function uploadBadgeImage(file: File, badgeId: string): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${badgeId}-${Date.now()}.${fileExt}`;
    const filePath = `badges/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('badges')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('badges')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    logger.error('Badge image upload failed', { error, context: 'ImageUpload' });
    throw new Error(error.message || 'Failed to upload badge image. Please try again.');
  }
}

// Helper to convert file to base64 (fallback if storage not available)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

