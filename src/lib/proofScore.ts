// ProofScore™ calculation for AURIN v1
// Formula: clamp(round(40*OrganizerRep + 30*Rarity + 20*Recency + 10*Streak), 0, 100)

export interface ProofScoreInputs {
  organizerRep: number; // 0-100
  rarity: 'common' | 'rare' | 'legendary';
  daysSinceLastProof: number;
  streakDays: number;
}

export function calculateProofScore(inputs: ProofScoreInputs): number {
  // OrganizerRep component (0-1 scale)
  const organizerRepComponent = inputs.organizerRep / 100;

  // Rarity component
  const rarityMap = {
    common: 0.2,
    rare: 0.6,
    legendary: 1.0,
  };
  const rarityComponent = rarityMap[inputs.rarity] || 0.2;

  // Recency component (exponential decay)
  // Formula: exp(-daysSinceLastProof / 30) scaled to 0-1
  const recencyComponent = Math.exp(-inputs.daysSinceLastProof / 30);
  const recencyScaled = Math.min(recencyComponent, 1);

  // Streak component (capped at 30 days)
  const streakComponent = Math.min(inputs.streakDays / 30, 1);

  // Weighted sum
  const score =
    40 * organizerRepComponent +
    30 * rarityComponent +
    20 * recencyScaled +
    10 * streakComponent;

  // Clamp to 0-100
  return Math.round(Math.max(0, Math.min(100, score)));
}

export async function recomputeUserProofScore(userId: string) {
  // This would be called by a cron job or after badge issuance
  // For now, return a placeholder
  // In production, this would query the database and calculate
  return 50; // Placeholder
}

