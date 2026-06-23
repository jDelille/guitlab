import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

interface UserStats {
  totalPoints: number;
  totalAttempts: number;
  solvedCombos: number;
  bestScore: number;
}

interface ActivityEntry {
  drillName: string;
  key: string;
  shape: string;
  scale: string;
  bestScore: number;
  date: string;
}

const DRILL_NAMES: Record<string, string> = {
  "caged-scales": "Map the CAGED Scale",
};

const SCALE_LABELS: Record<string, string> = {
  majorPentatonic: "Major Pent.",
  majorScale: "Major Scale",
  arpeggio: "Arpeggio",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const [profileRes, progressRes, recentRes] = await Promise.all([
        supabase.from("profiles").select("total_points").eq("id", session.user.id).single(),
        supabase.from("drill_progress").select("drill_id, best_score, attempts, completed").eq("user_id", session.user.id),
        supabase.from("drill_progress")
          .select("drill_id, key, shape, scale, best_score, updated_at")
          .eq("user_id", session.user.id)
          .order("updated_at", { ascending: false })
          .limit(3),
      ]);

      const totalPoints = profileRes.data?.total_points ?? 0;
      const progress = progressRes.data ?? [];
      const totalAttempts = progress.reduce((sum, r) => sum + (r.attempts ?? 0), 0);
      const solvedCombos = progress.filter((r) => r.completed).length;
      const bestScore = progress.length ? Math.max(...progress.map((r) => r.best_score ?? 0)) : 0;
      setStats({ totalPoints, totalAttempts, solvedCombos, bestScore });

      const drillCounts: Record<string, number> = {};
      for (const r of progress) {
        if (r.completed) drillCounts[r.drill_id] = (drillCounts[r.drill_id] ?? 0) + 1;
      }
      setCompletedDrills(new Set(Object.entries(drillCounts).filter(([, n]) => n >= 35).map(([id]) => id)));

      const recent = (recentRes.data ?? []).map((r) => ({
        drillName: DRILL_NAMES[r.drill_id] ?? r.drill_id,
        key: r.key,
        shape: r.shape,
        scale: SCALE_LABELS[r.scale] ?? r.scale,
        bestScore: r.best_score,
        date: formatDate(r.updated_at),
      }));
      setActivity(recent);
      setLoading(false);
    }

    fetchUserData();
  }, []);

  return { stats, activity, completedDrills, loading };
}
