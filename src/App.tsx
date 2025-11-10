// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import CreateEvent from './pages/CreateEvent';
import WalletConnect from './pages/WalletConnect';
import EmailVerification from './pages/EmailVerification';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

import ErrorBoundary from './components/ErrorBoundary';

import { ToastProvider } from './components/ui/use-toast';
import Toaster from './components/ui/toaster';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><WalletConnect /></ProtectedRoute>} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />

      <Route path="/profile/:username" element={<PublicProfile />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ToastProvider>
            <AppRoutes />
            <Toaster />
          </ToastProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
