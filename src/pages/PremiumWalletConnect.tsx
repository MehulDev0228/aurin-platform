// src/pages/PremiumWalletConnect.tsx - Premium Wallet Connection Page
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, AlertCircle, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { connectWallet, isWalletAvailable, signOwnership } from '../hooks/useWallet';
import { supabase } from '../lib/supabase';
import SteveJobsNavbar from '../components/SteveJobsNavbar';
import RippleButton from '../components/aceternity/RippleButton';
import { useToast } from '../components/ui/use-toast';

export default function PremiumWalletConnect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => { 
    setSaved(false); 
    setErr(null); 
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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

  const doConnect = async () => {
    if (!isWalletAvailable()) { 
      setErr('No wallet detected. Please install MetaMask or another Web3 wallet.'); 
      return; 
    }
    setBusy(true); 
    setErr(null); 
    setSaved(false);
    try {
      const { address } = await connectWallet();
      setAddress(address);

      const { signature, message } = await signOwnership(address);

      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_address: address, 
          wallet_signature: signature, 
          wallet_sig_message: message,
          wallet_connected: true 
        } as any)
        .eq('id', user.id);
      if (error) throw error;

      setSaved(true);
      toast({
        title: 'Wallet Connected!',
        description: 'Your wallet has been successfully connected.',
      });
      
      // Redirect to onboarding after 2 seconds
      setTimeout(() => {
        navigate('/onboarding', { replace: true });
      }, 2000);
    } catch (e: any) {
      setErr(e?.message || 'Failed to connect wallet.');
      toast({
        title: 'Connection Failed',
        description: e?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SteveJobsNavbar />
      
      <div className="relative overflow-hidden pt-28">
        {/* Animated background - Green theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] via-transparent to-teal-500/[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
        
        <div className="relative max-w-2xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {saved ? (
              <>
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/30 mb-8"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle2 size={48} className="text-emerald-400" />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent tracking-[-0.02em]">
                  Wallet Connected!
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Redirecting to onboarding...
                </p>
              </>
            ) : (
              <>
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/30 mb-8"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(16, 185, 129, 0.4)',
                      '0 0 0 20px rgba(16, 185, 129, 0)',
                      '0 0 0 0 rgba(16, 185, 129, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wallet size={48} className="text-emerald-400" strokeWidth={2} />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent tracking-[-0.02em]">
                  Connect Your Wallet
                </h1>
                <p className="text-xl text-gray-400 mb-2">
                  Link your blockchain wallet to receive NFT badges
                </p>
              </>
            )}
          </motion.div>

          {!saved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-6 tracking-[-0.02em]">Step-by-Step Guide</h3>
                  <div className="space-y-4 mb-8">
                    {[
                      { step: 1, title: 'Install MetaMask', desc: 'If you don\'t have a wallet, install MetaMask browser extension' },
                      { step: 2, title: 'Click Connect', desc: 'Click the button below to connect your wallet' },
                      { step: 3, title: 'Approve Connection', desc: 'Approve the connection request in MetaMask' },
                      { step: 4, title: 'Sign Message', desc: 'Sign a message to verify wallet ownership (no funds required)' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-[15px] tracking-[-0.01em]">{item.title}</h4>
                          <p className="text-gray-400 text-sm leading-relaxed tracking-[-0.01em]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6 p-6 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={24} className="text-emerald-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 tracking-[-0.01em]">Why Connect Your Wallet?</h3>
                    <p className="text-gray-300 text-sm leading-relaxed tracking-[-0.01em]">
                      Your wallet allows you to receive NFT badges on the blockchain. We'll verify ownership with a signature - no funds required. Your badges will be permanently stored on-chain.
                    </p>
                  </div>
                </div>

                {!isWalletAvailable() && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-400 font-semibold mb-1">No Wallet Detected</p>
                        <p className="text-xs text-gray-400 mb-3">
                          Please install MetaMask or another Web3 wallet to continue.
                        </p>
                        <a
                          href="https://metamask.io/download"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <span>Install MetaMask</span>
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <RippleButton
                  onClick={doConnect}
                  disabled={busy || !isWalletAvailable()}
                  className="w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-[15px] tracking-[-0.01em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-500"
                >
                  {busy ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet size={20} />
                      <span>Connect & Verify Wallet</span>
                    </>
                  )}
                </RippleButton>

                {address && (
                  <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Connected Address:</p>
                    <p className="text-sm font-mono text-white break-all">{address}</p>
                  </div>
                )}

                {err && (
                  <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400">{err}</p>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20">
                <p className="text-sm text-gray-300 leading-relaxed tracking-[-0.01em]">
                  <strong className="text-emerald-400">Secure:</strong> We only request a signature to verify ownership. No funds are required, and we never ask for your private keys. Your wallet remains completely secure.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

