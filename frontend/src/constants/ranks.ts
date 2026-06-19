export const RANKS = ["Novice", "Bedroom Guitarist", "Local Legend", "Face Melter", "Guitar Hero"];
export const RANK_THRESHOLDS = [0, 2500, 5000, 7500, 10000];

export function getRankInfo(points: number) {
  let rank = RANKS[0];
  let nextRank: string | null = RANKS[1];
  let nextRankPoints: number | null = RANK_THRESHOLDS[1];
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= RANK_THRESHOLDS[i]) {
      rank = RANKS[i];
      nextRank = RANKS[i + 1] ?? null;
      nextRankPoints = RANK_THRESHOLDS[i + 1] ?? null;
      break;
    }
  }
  return { rank, nextRank, nextRankPoints };
}
