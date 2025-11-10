// src/pages/CreateEvent.tsx
import { useState } from 'react';
import { Calendar, FileText, Clock, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../lib/logger';
import { parseError, retryWithBackoff } from '../lib/errorHandler';
import { useToast } from '../components/ui/use-toast';
import SteveJobsNavbar from '../components/SteveJobsNavbar';
import { eventSchema } from '../lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
  });

  const submit = async (data: any) => {
    if (!user?.id) return;

    setBusy(true);
    try {
      await retryWithBackoff(async () => {
        const { error } = await (supabase.from('events') as any).insert({
          title: data.title.trim(),
          description: data.description.trim(),
          start_date: data.start_date,
          end_date: data.end_date,
          location: data.location || null,
          category: data.category || null,
          event_type: data.event_type || 'online',
          max_attendees: data.max_attendees || null,
          organizer_id: user.id,
          status: 'published',
        });
        if (error) throw error;
      });

      toast({
        title: 'Event created successfully!',
        description: 'Your event has been published and is now visible to users.',
      });
      reset();
      setTimeout(() => navigate('/events'), 1500);
    } catch (e: any) {
      const errorInfo = parseError(e);
      logger.error('Failed to create event', { error: e, context: 'CreateEvent', userId: user.id });
      toast({
        title: 'Failed to create event',
        description: errorInfo.message,
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <SteveJobsNavbar />
        <div className="flex items-center justify-center min-h-[80vh] p-6">
          <div className="max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in</h2>
            <Link to="/login" className="text-emerald-400 hover:underline">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-[-0.02em] bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent">
            Create Event
          </h1>
          <p className="text-gray-400 text-lg">Organize an event and award verified badges</p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="premium-card p-8 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2">
                Event Title
              </label>
              <div className="relative">
                <FileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  placeholder="React Development Workshop"
                  aria-invalid={errors.title ? 'true' : 'false'}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                    errors.title ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                  }`}
                />
              </div>
              {errors.title && (
                <p id="title-error" className="text-red-400 text-xs mt-1" role="alert">
                  {errors.title.message as string}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Describe your event in detail..."
                rows={6}
                aria-invalid={errors.description ? 'true' : 'false'}
                aria-describedby={errors.description ? 'description-error' : undefined}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                }`}
              />
              {errors.description && (
                <p id="description-error" className="text-red-400 text-xs mt-1" role="alert">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-semibold mb-2">
                  Start Date & Time
                </label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="start_date"
                    type="datetime-local"
                    {...register('start_date')}
                    aria-invalid={errors.start_date ? 'true' : 'false'}
                    aria-describedby={errors.start_date ? 'start_date-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:bg-white/10 transition-all ${
                      errors.start_date ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.start_date && (
                  <p id="start_date-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.start_date.message as string}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-semibold mb-2">
                  End Date & Time
                </label>
                <div className="relative">
                  <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="end_date"
                    type="datetime-local"
                    {...register('end_date')}
                    aria-invalid={errors.end_date ? 'true' : 'false'}
                    aria-describedby={errors.end_date ? 'end_date-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:bg-white/10 transition-all ${
                      errors.end_date ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.end_date && (
                  <p id="end_date-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.end_date.message as string}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-semibold mb-2">
                Location (Optional)
              </label>
              <input
                id="location"
                type="text"
                {...register('location')}
                placeholder="San Francisco, CA or Online"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Cancel and go back to dashboard"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={busy}
              aria-label="Create event"
              aria-busy={busy}
              className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" aria-hidden="true" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save size={20} aria-hidden="true" />
                  <span>Create Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
