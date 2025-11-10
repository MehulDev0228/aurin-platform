// src/lib/blockchain.ts
import { ethers } from 'ethers';
import { ENV, blockchainEnabled } from './env';
import { ERC1155_ABI } from './abi/erc1155';
import { ERC721_ABI } from './abi/erc721';

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
  const provider = new ethers.BrowserProvider(window.ethereum);
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
  const provider = new ethers.BrowserProvider(window.ethereum);
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

  let tx: ethers.TransactionResponse;
  if (ENV.CONTRACT_STANDARD === 'ERC721') {
    tx = await contract.safeMint(options.toAddress, options.tokenURI);
  } else {
    const id = options.tokenId ?? 1;
    const amt = options.amount ?? 1;
    tx = await contract.mintTo(options.toAddress, id, amt, '0x');
  }

  const receipt = await tx.wait();
  const txHash = receipt?.hash || tx.hash;

  let mintedTokenId: string | undefined;
  try {
    if (ENV.CONTRACT_STANDARD === 'ERC721' && receipt?.logs?.length) {
      // If your ERC721 emits Transfer, you can parse logs by extending ABI with the event.
      // Kept minimal here; tokenId may remain undefined depending on your contract.
    }
  } catch { /* ignore */ }

  return { chainId: ENV.CHAIN_ID, txHash, tokenId: mintedTokenId };
}
