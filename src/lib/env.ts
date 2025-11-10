// src/lib/env.ts - Environment variable validation
type Maybe<T> = T | undefined;

function readEnv(name: string, opts?: { required?: boolean }) {
  const value = (import.meta as any).env?.[name] as Maybe<string>;
  if (opts?.required && !value) {
    const error = new Error(`Missing required environment variable: ${name}`);
    // Show user-friendly error in production
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error(`Configuration Error: ${error.message}`);
      // In production, you might want to show a user-friendly error page
    }
    throw error;
  }
  return value?.trim();
}

// Validate environment variables on module load
function validateEnv() {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing: string[] = [];
  
  required.forEach((name) => {
    const value = (import.meta as any).env?.[name];
    if (!value || !value.trim()) {
      missing.push(name);
    }
  });
  
  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('Configuration Error:', error.message);
    }
    throw error;
  }
}

// Validate on module load
validateEnv();

export const ENV = {
  SUPABASE_URL: readEnv('VITE_SUPABASE_URL', { required: true })!,
  SUPABASE_ANON: readEnv('VITE_SUPABASE_ANON_KEY', { required: true })!,

  CONTRACT_ADDRESS: readEnv('VITE_CONTRACT_ADDRESS'),
  CONTRACT_STANDARD: (readEnv('VITE_CONTRACT_STANDARD') || 'ERC1155') as 'ERC1155' | 'ERC721',

  CHAIN_ID: readEnv('VITE_CHAIN_ID') || '0x2105', // Base mainnet default
  CHAIN_NAME: readEnv('VITE_CHAIN_NAME') || 'Base',
  RPC_URL: readEnv('VITE_RPC_URL') || 'https://mainnet.base.org',
  BLOCK_EXPLORER: readEnv('VITE_BLOCK_EXPLORER') || 'https://basescan.org',
  IPFS_GATEWAY: readEnv('VITE_IPFS_GATEWAY') || 'https://ipfs.io/ipfs/',
};

export function blockchainEnabled() {
  return Boolean(ENV.CONTRACT_ADDRESS);
}
