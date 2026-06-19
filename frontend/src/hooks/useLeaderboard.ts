import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, []);

  return leaderboard;
}
