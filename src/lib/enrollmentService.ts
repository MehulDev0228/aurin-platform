import { supabase } from './supabase';

export interface EnrollInEventParams {
  eventId: string;
  userId: string;
}

export async function enrollInEvent(params: EnrollInEventParams) {
  try {
    const { data: existingEnrollment } = await supabase
      .from('event_enrollments')
      .select('id, status')
      .eq('event_id', params.eventId)
      .eq('user_id', params.userId)
      .maybeSingle();

    if (existingEnrollment) {
      if (existingEnrollment.status === 'cancelled') {
        const { data, error } = await supabase
          .from('event_enrollments')
          .update({ status: 'enrolled', enrolled_at: new Date().toISOString() })
          .eq('id', existingEnrollment.id)
          .select()
          .single();

        if (error) throw error;
        return { success: true, enrollment: data, message: 'Re-enrolled successfully!' };
      }
      return { success: false, error: 'Already enrolled in this event' };
    }

    const { data: event } = await supabase
      .from('events')
      .select('max_attendees, current_attendees')
      .eq('id', params.eventId)
      .single();

    if (event && event.current_attendees >= event.max_attendees) {
      return { success: false, error: 'Event is full' };
    }

    const { data: enrollment, error } = await supabase
      .from('event_enrollments')
      .insert({
        event_id: params.eventId,
        user_id: params.userId,
        status: 'enrolled',
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('events')
      .update({ current_attendees: (event?.current_attendees || 0) + 1 })
      .eq('id', params.eventId);

    return { success: true, enrollment, message: 'Enrolled successfully!' };
  } catch (error: any) {
    console.error('Enroll in event error:', error);
    return { success: false, error: error.message };
  }
}

export async function cancelEnrollment(enrollmentId: string) {
  try {
    const { data: enrollment } = await supabase
      .from('event_enrollments')
      .select('event_id')
      .eq('id', enrollmentId)
      .single();

    if (!enrollment) {
      return { success: false, error: 'Enrollment not found' };
    }

    const { error } = await supabase
      .from('event_enrollments')
      .update({ status: 'cancelled' })
      .eq('id', enrollmentId);

    if (error) throw error;

    const { data: event } = await supabase
      .from('events')
      .select('current_attendees')
      .eq('id', enrollment.event_id)
      .single();

    if (event && event.current_attendees > 0) {
      await supabase
        .from('events')
        .update({ current_attendees: event.current_attendees - 1 })
        .eq('id', enrollment.event_id);
    }

    return { success: true, message: 'Enrollment cancelled' };
  } catch (error: any) {
    console.error('Cancel enrollment error:', error);
    return { success: false, error: error.message };
  }
}

export async function checkInUser(enrollmentId: string) {
  try {
    const { data, error } = await supabase
      .from('event_enrollments')
      .update({
        status: 'attended',
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, enrollment: data };
  } catch (error: any) {
    console.error('Check in user error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserEnrollments(userId: string) {
  try {
    const { data, error } = await supabase
      .from('event_enrollments')
      .select(`
        *,
        events (
          id,
          title,
          description,
          start_date,
          end_date,
          location,
          image_url,
          category,
          event_type
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get user enrollments error:', error);
    return [];
  }
}

export async function getEventEnrollments(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('event_enrollments')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          username,
          avatar_url,
          email_verified
        )
      `)
      .eq('event_id', eventId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get event enrollments error:', error);
    return [];
  }
}

export async function isUserEnrolled(userId: string, eventId: string) {
  try {
    const { data } = await supabase
      .from('event_enrollments')
      .select('id, status')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    return data && data.status !== 'cancelled';
  } catch (error) {
    return false;
  }
}
