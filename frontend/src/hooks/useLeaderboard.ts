import { useCallback, useEffect, useRef, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
}

const RETRY_DELAYS = [4000, 8000];

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Invalid response");
  return data;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cancelledRef = useRef(false);

  const load = useCallback(async () => {
    cancelledRef.current = false;
    setLoading(true);
    setError(false);

    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        const data = await fetchLeaderboard();
        if (cancelledRef.current) return;
        setLeaderboard(data);
        setLoading(false);
        return;
      } catch {
        if (cancelledRef.current) return;
        if (attempt < RETRY_DELAYS.length) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
        }
      }
    }

    if (!cancelledRef.current) {
      setLoading(false);
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      cancelledRef.current = true;
    };
  }, [load]);

  return { leaderboard, loading, error, retry: load };
}
