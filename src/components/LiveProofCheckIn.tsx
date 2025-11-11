// LiveProof™ check-in component for AURIN v1
// QR scan + selfie + geo verification

import { useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle2, X } from 'lucide-react';
import { createCheckIn, getDeviceFingerprint } from '../lib/liveProof';
import { useToast } from './ui/use-toast';
import { logger } from '../lib/logger';

interface LiveProofCheckInProps {
  eventId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function LiveProofCheckIn({ eventId, onSuccess, onClose }: LiveProofCheckInProps) {
  const [step, setStep] = useState<'qr' | 'selfie' | 'geo' | 'complete'>('qr');
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleQRScan = () => {
    // In production, use QR scanner library
    // For now, simulate scan
    setStep('selfie');
  };

  const handleSelfieCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhoto(result);
      setStep('geo');
    };
    reader.readAsDataURL(file);
  };

  const handleGeoCapture = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description: 'Please enable location services',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        handleSubmit();
      },
      (error: GeolocationPositionError) => {
        logger.error('Geolocation error', { error: error.message || 'Unknown error', context: 'LiveProofCheckIn' });
        toast({
          title: 'Location access denied',
          description: 'Please allow location access to complete check-in',
        });
      }
    );
  };

  const handleSubmit = async () => {
    if (!photo || !location) return;

    setLoading(true);
    try {
      // In production, upload to Supabase Storage via Edge Function
      const photoUrl = photo; // Placeholder - will be uploaded via Edge Function

      // Create check-in
      await createCheckIn({
        eventId,
        photoUrl,
        lat: location.lat,
        lng: location.lng,
        deviceFingerprint: getDeviceFingerprint(),
      });

      toast({
        title: 'Check-in successful!',
        description: 'Your LiveProof has been recorded',
      });

      setStep('complete');
      onSuccess?.();
    } catch (error: any) {
      logger.error('Check-in failed', { error, context: 'LiveProofCheckIn' });
      toast({
        title: 'Check-in failed',
        description: error.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">LiveProof Check-In</h2>
          {onClose && (
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X size={24} />
            </button>
          )}
        </div>

        {step === 'qr' && (
          <div className="space-y-4">
            <p className="text-white/80">Scan QR code at event location</p>
            <div className="bg-white p-8 rounded-xl flex items-center justify-center">
              <div className="text-4xl">📱</div>
              {/* In production, render actual QR code */}
            </div>
            <button onClick={handleQRScan} className="btn-primary w-full">
              I've Scanned the QR Code
            </button>
          </div>
        )}

        {step === 'selfie' && (
          <div className="space-y-4">
            <p className="text-white/80">Take a selfie for verification</p>
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Selfie" className="w-full rounded-xl" />
                <button
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-12 flex flex-col items-center justify-center space-y-4">
                <Camera size={48} className="text-white/40" />
                <button onClick={handleSelfieCapture} className="btn-primary">
                  Capture Selfie
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
            {photo && (
              <button onClick={() => setStep('geo')} className="btn-primary w-full">
                Continue
              </button>
            )}
          </div>
        )}

        {step === 'geo' && (
          <div className="space-y-4">
            <p className="text-white/80">Verify your location</p>
            <div className="bg-white/5 rounded-xl p-12 flex flex-col items-center justify-center space-y-4">
              <MapPin size={48} className="text-white/40" />
              <button onClick={handleGeoCapture} className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Capture Location'}
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4 text-center">
            <CheckCircle2 size={64} className="text-brand-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">Check-in Complete!</h3>
            <p className="text-white/80">Your LiveProof has been recorded</p>
            <button onClick={onClose} className="btn-primary w-full">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

