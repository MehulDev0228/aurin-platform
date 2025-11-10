// src/hooks/useWallet.ts
import { ensureNetwork, getSigner, isBrowserWalletAvailable } from '../lib/blockchain';
import { ethers } from 'ethers';

export function isWalletAvailable() {
  return isBrowserWalletAvailable();
}

export async function connectWallet(): Promise<{ address: string; chainId: string }> {
  await ensureNetwork();
  const signer = await getSigner();
  const address = await signer.getAddress();
  const network = await (signer.provider as ethers.BrowserProvider).getNetwork();
  const chainId = `0x${Number(network.chainId).toString(16)}`;
  return { address, chainId };
}

export async function signOwnership(address: string) {
  const signer = await getSigner();
  const message = `Verify wallet ownership: ${address}`;
  const signature = await signer.signMessage(message);
  // Optional: quick local recovery proof
  const recovered = ethers.verifyMessage(message, signature);
  const ok = recovered.toLowerCase() === address.toLowerCase();
  if (!ok) throw new Error('Signature verification failed.');
  return { signature, message };
}
