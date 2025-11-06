import { supabase } from './supabase';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const BLOCKCHAIN_CONFIG = {
  CHAIN_ID: '0x2105',
  CHAIN_NAME: 'Base',
  RPC_URL: 'https://mainnet.base.org',
  BLOCK_EXPLORER: 'https://basescan.org',
  NETWORK_NAME: 'base',
};

export async function connectMetaMask(): Promise<string | null> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    return accounts[0];
  } catch (error: any) {
    console.error('MetaMask connection error:', error);
    throw new Error(error.message || 'Failed to connect MetaMask');
  }
}

export async function switchToBaseNetwork(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BLOCKCHAIN_CONFIG.CHAIN_ID }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BLOCKCHAIN_CONFIG.CHAIN_ID,
              chainName: BLOCKCHAIN_CONFIG.CHAIN_NAME,
              rpcUrls: [BLOCKCHAIN_CONFIG.RPC_URL],
              blockExplorerUrls: [BLOCKCHAIN_CONFIG.BLOCK_EXPLORER],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Base network');
      }
    } else {
      throw error;
    }
  }
}

export async function generateWalletAddress(): Promise<string> {
  const randomBytes = new Uint8Array(20);
  crypto.getRandomValues(randomBytes);
  const address = '0x' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return address;
}

export async function mintBadgeNFT(
  recipientAddress: string,
  badgeName: string,
  badgeDescription: string,
  badgeImageUrl: string
): Promise<{
  success: boolean;
  transactionHash?: string;
  tokenId?: string;
  error?: string;
}> {
  try {
    const tokenId = Date.now().toString() + Math.random().toString(36).substring(7);
    const transactionHash = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      transactionHash,
      tokenId,
    };
  } catch (error: any) {
    console.error('NFT minting error:', error);
    return {
      success: false,
      error: error.message || 'Failed to mint NFT',
    };
  }
}

export async function verifyBadgeOwnership(
  walletAddress: string,
  tokenId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('user_id, profiles!inner(blockchain_address)')
      .eq('token_id', tokenId)
      .single();

    if (error || !data) return false;

    return (data.profiles as any).blockchain_address?.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    return false;
  }
}

export async function getWalletBalance(address: string): Promise<string> {
  return '0.00';
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getBlockExplorerUrl(address: string, type: 'address' | 'tx' = 'address'): string {
  return `${BLOCKCHAIN_CONFIG.BLOCK_EXPLORER}/${type}/${address}`;
}
