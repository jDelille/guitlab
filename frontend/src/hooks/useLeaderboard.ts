import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, []);

  return leaderboard;
}
