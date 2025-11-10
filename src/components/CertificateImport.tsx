// src/components/CertificateImport.tsx - Import existing certificates/achievements
import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/use-toast';
import { logger } from '../lib/logger';
import Button from './Button';
import Modal from './Modal';

interface CertificateData {
  name: string;
  issuer: string;
  issueDate: string;
  description?: string;
  imageUrl?: string;
  certificateUrl?: string;
}

export default function CertificateImport({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'upload' | 'review' | 'processing'>('upload');
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [currentCert, setCurrentCert] = useState<CertificateData>({
    name: '',
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For MVP, we'll just extract filename and let user fill in details
    // In production, you could use OCR or PDF parsing
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setCurrentCert({
      ...currentCert,
      name: fileName,
    });
    setStep('review');
  };

  const addCertificate = () => {
    if (!currentCert.name || !currentCert.issuer || !currentCert.issueDate) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in name, issuer, and issue date',
        variant: 'destructive',
      });
      return;
    }

    setCertificates([...certificates, currentCert]);
    setCurrentCert({
      name: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      description: '',
    });
    toast({
      title: 'Certificate added',
      description: 'Add more or proceed to import',
    });
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const importCertificates = async () => {
    if (certificates.length === 0) {
      toast({
        title: 'No certificates',
        description: 'Please add at least one certificate',
        variant: 'destructive',
      });
      return;
    }

    if (!user) return;

    setStep('processing');
    setUploading(true);

    try {
      // First, get or create badges for each certificate
      const badgePromises = certificates.map(async (cert) => {
        // Check if badge exists
        const { data: existingBadge } = await supabase
          .from('badges')
          .select('id')
          .eq('name', cert.name)
          .maybeSingle();

        let badgeId: string;

        if (existingBadge) {
          badgeId = (existingBadge as any).id;
        } else {
          // Create new badge
          const { data: newBadge, error: badgeError } = await (supabase.from('badges') as any)
            .insert({
              name: cert.name,
              description: cert.description || `Certificate from ${cert.issuer}`,
              image_url: cert.imageUrl || 'https://via.placeholder.com/400x400/10b981/ffffff?text=Certificate',
              category: 'certification',
              issuer_id: null, // Could create issuer if needed
              is_active: true,
            })
            .select('id')
            .single();

          if (badgeError) throw badgeError;
          badgeId = (newBadge as any).id;
        }

        // Create achievement
        const { error: achievementError } = await (supabase.from('achievements') as any)
          .insert({
            user_id: user.id,
            badge_id: badgeId,
            earned_at: cert.issueDate,
            blockchain_verified: false,
            metadata: {
              imported: true,
              issuer: cert.issuer,
              certificateUrl: cert.certificateUrl,
            },
            is_public: true,
          });

        if (achievementError) throw achievementError;
      });

      await Promise.all(badgePromises);

      toast({
        title: 'Success!',
        description: `Imported ${certificates.length} certificate${certificates.length > 1 ? 's' : ''}`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      logger.error('Certificate import failed', { error, context: 'CertificateImport', userId: user?.id });
      toast({
        title: 'Import failed',
        description: error?.message || 'Unable to import certificates. Please try again or contact support if the issue persists.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Import Certificates" size="lg">
      <div className="space-y-6">
        {step === 'upload' && (
          <>
            <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl hover:border-emerald-500/30 transition-colors">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2">Upload Certificate</p>
              <p className="text-sm text-gray-400 mb-4">
                Upload a PDF or image of your certificate, or manually add details
              </p>
              <label className="inline-block cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:shadow-emerald hover:scale-105 active:scale-95 transition-all">
                  Choose File
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-4">Or add manually below</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Certificate Name *</label>
                <input
                  type="text"
                  value={currentCert.name}
                  onChange={(e) => setCurrentCert({ ...currentCert, name: e.target.value })}
                  placeholder="e.g., AWS Solutions Architect"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issuer *</label>
                <input
                  type="text"
                  value={currentCert.issuer}
                  onChange={(e) => setCurrentCert({ ...currentCert, issuer: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issue Date *</label>
                <input
                  type="date"
                  value={currentCert.issueDate}
                  onChange={(e) => setCurrentCert({ ...currentCert, issueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={currentCert.description}
                  onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
                  placeholder="Brief description of the certificate"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certificate URL (Optional)</label>
                <input
                  type="url"
                  value={currentCert.certificateUrl || ''}
                  onChange={(e) => setCurrentCert({ ...currentCert, certificateUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <Button onClick={addCertificate} variant="primary" className="w-full">
                Add Certificate
              </Button>
            </div>
          </>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Review Certificates</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep('upload')}>
                Add More
              </Button>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No certificates added yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{cert.name}</h4>
                        <p className="text-sm text-gray-400 mb-1">Issued by: {cert.issuer}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCertificate(index)}
                        className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X size={20} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={importCertificates}
                    isLoading={uploading}
                    className="flex-1"
                  >
                    Import {certificates.length} Certificate{certificates.length > 1 ? 's' : ''}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Importing certificates...</p>
            <p className="text-sm text-gray-400">This may take a moment</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

