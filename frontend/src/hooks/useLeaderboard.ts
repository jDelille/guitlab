import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => { setLeaderboard(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { leaderboard, loading };
}
