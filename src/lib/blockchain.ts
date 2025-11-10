// src/lib/blockchain.ts
import { ethers } from 'ethers';
import { ENV, blockchainEnabled } from './env';
import { ERC1155_ABI } from './abi/erc1155';
import { ERC721_ABI } from './abi/erc721';
import { logger } from './logger';

declare global {
  interface Window { ethereum?: any; }
}

export type MintResult = {
  chainId: string;
  txHash: string;
  tokenId?: string;
};

export function isBrowserWalletAvailable() {
  return typeof window !== 'undefined' && !!window.ethereum;
}

export async function ensureNetwork(): Promise<void> {
  if (!isBrowserWalletAvailable()) throw new Error('No wallet found. Please install MetaMask.');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const current = `0x${Number(network.chainId).toString(16)}`;
  if (current.toLowerCase() === ENV.CHAIN_ID.toLowerCase()) return;

  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: ENV.CHAIN_ID }],
  }).catch(async (err: any) => {
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: ENV.CHAIN_ID,
          chainName: ENV.CHAIN_NAME,
          rpcUrls: [ENV.RPC_URL],
          blockExplorerUrls: [ENV.BLOCK_EXPLORER],
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        }],
      });
    } else {
      throw err;
    }
  });
}

export async function getSigner(): Promise<ethers.Signer> {
  if (!isBrowserWalletAvailable()) throw new Error('No wallet found. Please install MetaMask.');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

export function getContract(signer: ethers.Signer) {
  if (!ENV.CONTRACT_ADDRESS) throw new Error('Contract address not configured.');
  const abi = ENV.CONTRACT_STANDARD === 'ERC721' ? ERC721_ABI : ERC1155_ABI;
  return new ethers.Contract(ENV.CONTRACT_ADDRESS, abi, signer);
}

export async function mintBadge(options: {
  toAddress: string;
  tokenURI: string;     // used for ERC721; optional hint for ERC1155
  tokenId?: number;     // ERC1155
  amount?: number;      // ERC1155 (default 1)
}): Promise<MintResult> {
  if (!blockchainEnabled()) throw new Error('BLOCKCHAIN_DISABLED');

  await ensureNetwork();
  const signer = await getSigner();
  const contract = getContract(signer);

  let tx: ethers.providers.TransactionResponse;
  if (ENV.CONTRACT_STANDARD === 'ERC721') {
    tx = await contract.safeMint(options.toAddress, options.tokenURI);
  } else {
    const id = options.tokenId ?? 1;
    const amt = options.amount ?? 1;
    tx = await contract.mintTo(options.toAddress, id, amt, '0x');
  }

  const receipt = await tx.wait();
  const txHash = tx.hash;

  let mintedTokenId: string | undefined;
  try {
    if (ENV.CONTRACT_STANDARD === 'ERC721' && receipt?.logs?.length) {
      // If your ERC721 emits Transfer, you can parse logs by extending ABI with the event.
      // Kept minimal here; tokenId may remain undefined depending on your contract.
    }
  } catch { /* ignore */ }

  return { chainId: ENV.CHAIN_ID, txHash, tokenId: mintedTokenId };
}

// Alternative function for eventQueries compatibility
export async function mintBadgeNFT(
  walletAddress: string,
  badgeName: string,
  badgeDescription: string,
  badgeImageUrl: string
): Promise<{ success: boolean; tokenId?: string; transactionHash?: string; error?: string }> {
  try {
    if (!blockchainEnabled()) {
      // If blockchain is disabled, return success without minting
      return { success: true };
    }

    // Create token URI metadata
    const metadata = {
      name: badgeName,
      description: badgeDescription,
      image: badgeImageUrl,
      attributes: [
        { trait_type: 'Badge Name', value: badgeName },
        { trait_type: 'Issued On', value: new Date().toISOString() },
      ],
    };

    // For MVP, we'll use a simple tokenURI (in production, upload to IPFS)
    const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

    const result = await mintBadge({
      toAddress: walletAddress,
      tokenURI,
      tokenId: 1, // Default token ID for ERC1155
      amount: 1,
    });

    return {
      success: true,
      tokenId: result.tokenId,
      transactionHash: result.txHash,
    };
  } catch (error: any) {
    logger.error('Failed to mint badge NFT', { error, context: 'Blockchain' });
    return {
      success: false,
      error: error?.message || 'Failed to mint NFT. Please try again or contact support if the issue persists.',
    };
  }
}