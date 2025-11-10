// src/lib/enrollmentService.ts
import { supabase } from './supabase';

export async function enrollInEvent(userId: string, eventId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, event_id: eventId, status: 'enrolled' } as any)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getEnrollment(userId: string, eventId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, status, attended')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
