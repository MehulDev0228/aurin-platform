// src/lib/badgeAwardingService.ts
import { supabase } from './supabase';
import { blockchainEnabled, ENV } from './env';
import { mintBadge } from './blockchain';

export interface AwardBadgeParams {
  userId: string;       // Supabase user UUID
  badgeId: string;      // DB badge id
  toAddress?: string;   // wallet (required if chain enabled)
  tokenURI?: string;    // ERC721 metadata URI (optional for 1155)
  tokenId?: number;     // ERC1155 id
  amount?: number;      // ERC1155 amount
  isFeatured?: boolean;
  makePublic?: boolean;
}

export async function awardBadge(params: AwardBadgeParams) {
  let txHash: string | null = null;
  let mintedTokenId: string | null = null;
  let chainVerified = false;

  if (blockchainEnabled()) {
    if (!params.toAddress) throw new Error('Wallet address (toAddress) required for on-chain minting.');
    const result = await mintBadge({
      toAddress: params.toAddress,
      tokenURI: params.tokenURI || '',
      tokenId: params.tokenId,
      amount: params.amount,
    });
    txHash = result.txHash;
    mintedTokenId = result.tokenId ?? null;
    chainVerified = true;
  }

  const { data: achievement, error } = await supabase
    .from('achievements')
    .insert({
      user_id: params.userId,
      badge_id: params.badgeId,
      token_id: mintedTokenId,
      transaction_hash: txHash,
      blockchain_verified: chainVerified,
      metadata: { tokenURI: params.tokenURI, chainId: ENV.CHAIN_ID, standard: ENV.CONTRACT_STANDARD },
      is_featured: !!params.isFeatured,
      is_public: params.makePublic ?? true,
    })
    .select('*')
    .single();

  if (error) throw error;
  return achievement;
}

export async function userHasBadge(userId: string, badgeId: string) {
  const { data, error } = await supabase
    .from('achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}
