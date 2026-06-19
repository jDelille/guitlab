import { Link } from "react-router-dom";
import "./Training.scss";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import DrillStats from "../components/drills/DrillStats";

const RANKS = ["Novice", "Bedroom Guitarist", "Local Legend", "Face Melter", "Guitar Hero"];
const RANK_THRESHOLDS = [0, 2500, 5000, 7500, 10000];

function getRankInfo(points: number) {
  let rank = RANKS[0];
  let nextRank = RANKS[1];
  let nextRankPoints = RANK_THRESHOLDS[1];
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


let drillsCache: any[] | null = null;

const Training = () => {
  const [drills, setDrills] = useState<any[]>(drillsCache ?? []);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ rank: number; username: string; points: number }[]>([]);

  useEffect(() => {
    if (drillsCache) return;
    fetch("http://127.0.0.1:8000/drills")
      .then((res) => res.json())
      .then((data) => {
        drillsCache = data;
        setDrills(data);
      });
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [profileRes, progressRes, recentRes] = await Promise.all([
        supabase.from("profiles").select("total_points").eq("id", session.user.id).single(),
        supabase.from("drill_progress").select("best_score, attempts, completed").eq("user_id", session.user.id),
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

      const recent = (recentRes.data ?? []).map((r) => ({
        drillName: DRILL_NAMES[r.drill_id] ?? r.drill_id,
        key: r.key,
        shape: r.shape,
        scale: SCALE_LABELS[r.scale] ?? r.scale,
        bestScore: r.best_score,
        date: formatDate(r.updated_at),
      }));
      setActivity(recent);
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, []);

  return (
    <div className="page-content">
      <div className="header">
        <div>
          <h1>Training</h1>
          <p>Test your knowledge of the CAGED system</p>
        </div>
        {stats && (() => {
          const { rank, nextRank, nextRankPoints } = getRankInfo(stats.totalPoints);
          return (
            <DrillStats
              solved={stats.solvedCombos}
              total={35}
              points={stats.totalPoints}
              rank={rank}
              nextRank={nextRank}
              nextRankPoints={nextRankPoints}
            />
          );
        })()}
      </div>

      <div className="plans">
        <ul>
          {drills.map((plan) => (
            <li key={plan.id} className={`plan ${plan.coming_soon ? "coming-soon" : ""}`}>
              {plan.coming_soon ? (
                <div>
                  <span className="difficulty">{plan.difficulty}</span>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
              ) : (
                <Link to={`/training/${plan.id}`}>
                  <span className="difficulty">{plan.difficulty}</span>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="training-bottom">
        <div className="stats">
          <h2>Your Stats</h2>
          {stats ? (
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-value">{stats.totalPoints}</span>
                <span className="stat-label">Total Points</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.totalAttempts}</span>
                <span className="stat-label">Attempts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.solvedCombos}</span>
                <span className="stat-label">Combos Solved</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.bestScore}%</span>
                <span className="stat-label">Best Score</span>
              </div>
            </div>
          ) : (
            <p className="stats-empty">Log in to see your stats</p>
          )}
        </div>

        <div className="leaderboard">
          <div className="section-header">
            <h2>Leaderboard</h2>
          </div>
          {leaderboard.length ? (
            <ul>
              {leaderboard.map((entry) => (
                <li key={entry.rank} className="leaderboard-entry">
                  <span className="rank">#{entry.rank}</span>
                  <span className="username">{entry.username}</span>
                  <span className="points">{entry.points} pts</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="stats-empty">No entries yet</p>
          )}
          {/* <Link to="/leaderboard" className="view-all">View leaderboard →</Link> */}
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {activity.length ? (
            <ul>
              {activity.map((item, i) => (
                <li key={i} className="activity-entry">
                  <div className="activity-info">
                    <span className="activity-drill">{item.drillName}</span>
                    <span className="activity-meta">
                      {item.key} · {item.shape} shape · {item.scale} · {item.date}
                    </span>
                  </div>
                  <span className="activity-score">{item.bestScore}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="stats-empty">No activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Training;
