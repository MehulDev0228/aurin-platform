// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CinematicIntro from './components/CinematicIntro';

import SteveJobsLanding from './pages/SteveJobsLanding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SteveJobsDashboard from './pages/SteveJobsDashboard';
import PublicProfile from './pages/PublicProfile';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import CreateEvent from './pages/CreateEvent';
import OrganizerDashboard from './pages/OrganizerDashboard';
import PremiumEmailVerification from './pages/PremiumEmailVerification';
import PremiumWalletConnect from './pages/PremiumWalletConnect';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

import ErrorBoundary from './components/ErrorBoundary';

import { ToastProvider } from './components/ui/use-toast';
import Toaster from './components/ui/toaster';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SteveJobsLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/email-verification" element={<ProtectedRoute><PremiumEmailVerification /></ProtectedRoute>} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />

      <Route path="/dashboard" element={<ProtectedRoute><SteveJobsDashboard /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><PremiumWalletConnect /></ProtectedRoute>} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/organizer" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />

      <Route path="/profile/:username" element={<PublicProfile />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if intro was already shown in this session
    const introShown = sessionStorage.getItem('aurin-intro-shown');
    if (introShown) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('aurin-intro-shown', 'true');
    setShowIntro(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ToastProvider>
            {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
            {!showIntro && (
              <>
                <AppRoutes />
                <Toaster />
              </>
            )}
          </ToastProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
