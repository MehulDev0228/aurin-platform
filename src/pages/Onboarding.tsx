import { useState } from 'react';
import { Award, ArrowRight, Upload, MapPin, Briefcase, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    title: '',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    avatar: ''
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { showToast } = useToast();

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await saveProfile();
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          bio: formData.bio,
          location: formData.location,
          title: formData.title,
          linkedin_url: formData.linkedin,
          github_url: formData.github,
          twitter_url: formData.twitter,
          website_url: formData.website,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      showToast('Profile setup complete!', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      showToast(error.message || 'Failed to save profile', 'error');
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
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-emerald-400/50 transition-colors">
                    <Upload size={32} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm text-gray-500 mt-2">Upload Photo</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Professional Title</label>
                <div className="relative">
                  <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Senior Full Stack Engineer"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
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
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Passionate about building scalable systems and mentoring developers. 10+ years of experience..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">{formData.bio.length}/500 characters</p>
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
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/yourname"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <div className="relative">
                  <Github size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="github.com/yourname"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <div className="relative">
                  <Twitter size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="twitter.com/yourname"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <div className="relative">
                  <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="yourwebsite.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleNext}
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{saving ? 'Saving...' : step === 3 ? 'Finish' : 'Continue'}</span>
            {!saving && <ArrowRight size={20} />}
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
