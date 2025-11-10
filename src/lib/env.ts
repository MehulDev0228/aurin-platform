// src/lib/env.ts
type Maybe<T> = T | undefined;

function readEnv(name: string, opts?: { required?: boolean }) {
  const value = (import.meta as any).env?.[name] as Maybe<string>;
  if (opts?.required && !value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value?.trim();
}

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
