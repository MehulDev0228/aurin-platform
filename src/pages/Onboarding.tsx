import { useState, useRef, useEffect } from 'react';
import { Award, ArrowRight, Upload, MapPin, Briefcase, Linkedin, Github, Twitter, Globe, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/use-toast';
import { uploadAvatar, fileToBase64 } from '../lib/imageUpload';
import { onboardingSchema, type OnboardingFormData } from '../lib/validations';
import { logger } from '../lib/logger';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
  });

  const formData = watch();

  // Cleanup avatar preview on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      // Create preview
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);

      // Try to upload to Supabase Storage, fallback to base64
      let avatarUrl: string;
      try {
        if (user?.id) {
          avatarUrl = await uploadAvatar(file, user.id);
        } else {
          // Fallback to base64
          avatarUrl = await fileToBase64(file);
        }
        setValue('avatar', avatarUrl);
        toast({
          title: 'Photo uploaded',
          description: 'Your photo has been uploaded successfully',
        });
      } catch (error) {
        // Fallback to base64 if storage fails
        avatarUrl = await fileToBase64(file);
        setValue('avatar', avatarUrl);
        toast({
          title: 'Photo uploaded',
          description: 'Using local storage (storage bucket not configured)',
        });
      }
    } catch (error: any) {
      logger.error('Avatar upload failed', { error, context: 'Onboarding' });
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
    setValue('avatar', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      // Validate current step before proceeding
      const fieldsToValidate = step === 1 
        ? ['fullName', 'title', 'location'] 
        : step === 2 
        ? ['bio'] 
        : ['linkedin', 'github', 'twitter', 'website'];
      
      const isValid = await trigger(fieldsToValidate as any);
      if (isValid) {
        setStep(step + 1);
      }
    } else {
      // Final step - validate all and save
      await handleSubmit(saveProfile)();
    }
  };

  const saveProfile = async (data: OnboardingFormData) => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName || null,
          bio: data.bio || null,
          location: data.location || null,
          title: data.title || null,
          linkedin_url: data.linkedin || null,
          github_url: data.github || null,
          twitter_url: data.twitter || null,
          website_url: data.website || null,
          avatar_url: data.avatar || null,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile setup complete!',
        description: 'Welcome to AURIN! Redirecting to your dashboard...',
      });
      // Redirect to dashboard after onboarding
      setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
    } catch (error: any) {
      logger.error('Failed to save profile', { error, context: 'Onboarding', userId: user.id });
      toast({
        title: 'Failed to save profile',
        description: error.message || 'Unable to save your profile. Please try again or contact support if the issue persists.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      navigate('/dashboard');
    } catch (error) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <Link to="/login" className="text-emerald-400 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 mb-6 shadow-2xl">
            <Award size={32} className="text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Welcome to Aurin!</h1>
          <p className="text-gray-400 text-lg">Let's set up your professional profile</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-12 bg-emerald-400' : s < step ? 'w-8 bg-emerald-400/50' : 'w-8 bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="premium-card p-8 mb-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                <p className="text-gray-400 text-sm">Tell us about yourself</p>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarPreview ? (
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-500/30">
                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                      >
                        <X size={16} className="text-white" />
                      </button>
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={uploadingAvatar}
                      className="relative group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-emerald-400/50 transition-colors">
                        {uploadingAvatar ? (
                          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload size={32} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm text-gray-500 mt-2">Upload Photo</span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName')}
                  placeholder="Alex Rivera"
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                  }`}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Professional Title
                </label>
                <div className="relative">
                  <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <input
                    id="title"
                    type="text"
                    {...register('title')}
                    placeholder="Senior Full Stack Engineer"
                    aria-invalid={errors.title ? 'true' : 'false'}
                    aria-describedby={errors.title ? 'title-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                      errors.title ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.title && (
                  <p id="title-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <input
                    id="location"
                    type="text"
                    {...register('location')}
                    placeholder="San Francisco, CA"
                    aria-invalid={errors.location ? 'true' : 'false'}
                    aria-describedby={errors.location ? 'location-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                      errors.location ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.location && (
                  <p id="location-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">About You</h2>
                <p className="text-gray-400 text-sm">Share your story and expertise</p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Passionate about building scalable systems and mentoring developers. 10+ years of experience..."
                  rows={6}
                  aria-invalid={errors.bio ? 'true' : 'false'}
                  aria-describedby={errors.bio ? 'bio-error' : 'bio-char-count'}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all resize-none ${
                    errors.bio ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                  }`}
                />
                <div className="flex items-center justify-between mt-2">
                  <p id="bio-char-count" className="text-xs text-gray-500">
                    {formData.bio?.length || 0}/500 characters
                  </p>
                  {errors.bio && (
                    <p id="bio-error" className="text-red-400 text-xs" role="alert">
                      {errors.bio.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm text-gray-300">
                  <strong className="text-emerald-400">Pro tip:</strong> A great bio highlights your expertise, passion, and what makes you unique. Keep it concise and authentic!
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Connect Your Profiles</h2>
                <p className="text-gray-400 text-sm">Link your social accounts (optional)</p>
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <input
                    id="linkedin"
                    type="text"
                    {...register('linkedin')}
                    placeholder="linkedin.com/in/yourname"
                    aria-invalid={errors.linkedin ? 'true' : 'false'}
                    aria-describedby={errors.linkedin ? 'linkedin-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                      errors.linkedin ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.linkedin && (
                  <p id="linkedin-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.linkedin.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="github" className="block text-sm font-medium mb-2">
                  GitHub
                </label>
                <div className="relative">
                  <Github size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <input
                    id="github"
                    type="text"
                    {...register('github')}
                    placeholder="github.com/yourname"
                    aria-invalid={errors.github ? 'true' : 'false'}
                    aria-describedby={errors.github ? 'github-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                      errors.github ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.github && (
                  <p id="github-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.github.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <input
                    id="twitter"
                    type="text"
                    {...register('twitter')}
                    placeholder="twitter.com/yourname"
                    aria-invalid={errors.twitter ? 'true' : 'false'}
                    aria-describedby={errors.twitter ? 'twitter-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                      errors.twitter ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.twitter && (
                  <p id="twitter-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.twitter.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                  <input
                    id="website"
                    type="text"
                    {...register('website')}
                    placeholder="yourwebsite.com"
                    aria-invalid={errors.website ? 'true' : 'false'}
                    aria-describedby={errors.website ? 'website-error' : undefined}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${
                      errors.website ? 'border-red-500' : 'border-white/10 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                {errors.website && (
                  <p id="website-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.website.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip onboarding"
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            aria-label={step === 3 ? 'Finish onboarding' : 'Continue to next step'}
            aria-busy={saving}
            className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" aria-hidden="true" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{step === 3 ? 'Finish' : 'Continue'}</span>
                <ArrowRight size={20} aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {step === 3 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            You can always update this information later in Settings
          </p>
        )}
      </div>
    </div>
  );
}
