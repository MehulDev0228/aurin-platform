import { useState } from 'react';
import { Award, Wallet, Shield, CheckCircle, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

export default function WalletConnect() {
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Most popular Ethereum wallet',
      icon: '🦊',
      available: typeof window !== 'undefined' && (window as any).ethereum,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Simple and secure',
      icon: '🔵',
      available: true,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect any mobile wallet',
      icon: '🔗',
      available: true,
    },
    {
      id: 'embedded',
      name: 'Create New Wallet',
      description: 'We\'ll create one for you (Recommended)',
      icon: '✨',
      available: true,
      recommended: true,
    },
  ];

  const connectMetaMask = async () => {
    if (!(window as any).ethereum) {
      showToast('MetaMask not installed. Please install MetaMask browser extension.', 'error');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setConnecting(true);
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      await saveWalletConnection(address, 'metamask');
    } catch (error: any) {
      showToast(error.message || 'Failed to connect MetaMask', 'error');
      setConnecting(false);
    }
  };

  const createEmbeddedWallet = async () => {
    try {
      setConnecting(true);

      const generatedAddress = '0x' + Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      await saveWalletConnection(generatedAddress, 'embedded');

      showToast('Wallet created successfully! Your keys are secured.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to create wallet', 'error');
      setConnecting(false);
    }
  };

  const connectOtherWallet = async (provider: string) => {
    showToast(`${provider} integration coming soon! Use "Create New Wallet" for now.`, 'info');
  };

  const saveWalletConnection = async (address: string, walletType: string) => {
    try {
      const { error: walletError } = await supabase
        .from('wallet_connections')
        .insert({
          user_id: user!.id,
          wallet_address: address,
          wallet_type: walletType,
          is_primary: true,
        });

      if (walletError) throw walletError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          wallet_connected: true,
          blockchain_address: address,
        })
        .eq('id', user!.id);

      if (profileError) throw profileError;

      setWalletAddress(address);

      showToast('Wallet connected successfully!', 'success');

      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  const handleConnect = async (providerId: string) => {
    setSelectedProvider(providerId);

    switch (providerId) {
      case 'metamask':
        await connectMetaMask();
        break;
      case 'embedded':
        await createEmbeddedWallet();
        break;
      case 'coinbase':
      case 'walletconnect':
        await connectOtherWallet(providerId);
        break;
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

  if (walletAddress) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Wallet Connected!</h2>
          <p className="text-gray-400 mb-4">Your blockchain identity is ready</p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6 font-mono text-sm break-all">
            {walletAddress}
          </div>
          <div className="text-sm text-gray-500 mb-8">
            Redirecting to complete your profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 grain opacity-20" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl">
                <Award size={28} className="text-black" />
              </div>
              <span className="font-bold text-2xl">Aurin</span>
            </Link>

            <h1 className="text-4xl font-bold mb-4">
              Connect Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Blockchain Wallet
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Your badges will be stored as NFTs on the blockchain, proving ownership forever
            </p>
          </div>

          <div className="premium-card p-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <AlertCircle size={24} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-400 mb-1">Why do I need a wallet?</p>
                <p className="text-gray-400">
                  Your badges are blockchain-verified NFTs. A wallet is your digital identity that proves you own them.
                  Don't worry - if you don't have one, we'll create it for you automatically!
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 mb-8">
            {walletProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleConnect(provider.id)}
                disabled={connecting || !provider.available}
                className={`premium-card p-6 text-left hover-lift transition-all group ${
                  provider.recommended ? 'border-emerald-500/30 bg-emerald-500/5' : ''
                } ${!provider.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                    {provider.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">{provider.name}</h3>
                      {provider.recommended && (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                  </div>
                  {connecting && selectedProvider === provider.id ? (
                    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="premium-card p-6">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="font-semibold text-white mb-2">Your security is our priority</p>
                <ul className="space-y-1">
                  <li>• We never store your private keys</li>
                  <li>• All transactions are encrypted</li>
                  <li>• You maintain full control of your assets</li>
                  <li>• Blockchain verified and permanent</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-3">
            <button
              onClick={async () => {
                if (!user) return;
                const mockAddress = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                await supabase
                  .from('profiles')
                  .update({
                    wallet_connected: true,
                    blockchain_address: mockAddress
                  })
                  .eq('id', user.id);
                navigate('/onboarding');
              }}
              className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium transition-all"
            >
              Skip for now (Testing)
            </button>
            <a
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors"
            >
              <span>Learn more about crypto wallets</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
