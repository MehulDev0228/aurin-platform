// src/lib/validations.ts - Zod validation schemas
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description too long'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(200, 'Location too long').optional(),
  category: z.string().optional(),
  event_type: z.enum(['online', 'in-person', 'hybrid']).optional(),
  max_attendees: z.number().min(1).max(10000).optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  location: z.string().max(200, 'Location too long').optional(),
  title: z.string().max(100, 'Title too long').optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  avatar: z.string().optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  location: z.string().max(200, 'Location too long').optional(),
  title: z.string().max(100, 'Title too long').optional(),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  twitter_url: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  website_url: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

export const certificateSchema = z.object({
  name: z.string().min(3, 'Certificate name must be at least 3 characters').max(200, 'Name too long'),
  issuer: z.string().min(2, 'Issuer must be at least 2 characters').max(200, 'Issuer too long'),
  issueDate: z.string().min(1, 'Issue date is required'),
  description: z.string().max(1000, 'Description too long').optional(),
  certificateUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type CertificateFormData = z.infer<typeof certificateSchema>;

