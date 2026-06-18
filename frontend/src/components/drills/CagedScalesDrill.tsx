import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ShapeName } from "../../constants/CagedChords";
import type { Scales } from "../../types/Scales";

import DrillFretboard from "../drill-fretboard/DrillFretboard";
import DrillStats from "./DrillStats";
import DrillRoadmap from "./DrillRoadmap";
import { supabase } from "../../services/supabase";
import {
  SCALE_LABELS,
  buildCorrectSet,
  scoreAnswer,
  getNextCombo,
  getPrefilledNotes,
  type ComboProgress,
} from "../../utils/drillUtils";
import "../../pages/Drill.scss";

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

const CagedScalesDrill = () => {
  const [progress, setProgress] = useState<ComboProgress[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const next = getNextCombo(progress);
  const [key, setKey] = useState<string>(next.key);
  const [shape, setShape] = useState<ShapeName>(next.shape);
  const [difficulty, setDifficulty] = useState("Novice");
  const [scale, setScale] = useState<Scales>(next.scale);

  const correct = useMemo(() => buildCorrectSet(key, shape, scale), [key, shape, scale]);
  const prefilled = useMemo(() => getPrefilledNotes(correct, difficulty), [correct, difficulty]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set(prefilled));
  const [result, setResult] = useState<(ReturnType<typeof scoreAnswer> & { pointsEarned?: number }) | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const [progressRes, profileRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/drill-progress", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
        supabase.from("profiles").select("total_points").eq("id", session.user.id).single(),
      ]);

      if (progressRes.ok) {
        const data = await progressRes.json();
        const mapped: ComboProgress[] = data.map((r: any) => ({
          key: r.key,
          shape: r.shape,
          scale: r.scale,
          bestScore: r.best_score,
        }));
        setProgress(mapped);
        const combo = getNextCombo(mapped);
        setKey(combo.key);
        setShape(combo.shape);
        setScale(combo.scale);
        setSelected(new Set(getPrefilledNotes(buildCorrectSet(combo.key, combo.shape, combo.scale), difficulty)));
      }

      if (profileRes.data) {
        setTotalPoints(profileRes.data.total_points ?? 0);
      }

      setLoading(false);
    }

    fetchProgress();
  }, []);

  const toggle = (k: string) => {
    if (prefilled.has(k)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  const handleSubmit = async () => {
    const scored = scoreAnswer(selected, correct);
    let pointsEarned = 0;

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const res = await fetch("http://127.0.0.1:8000/drill-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          drill_id: "caged-scales",
          key,
          shape,
          scale,
          score: scored.points,
          difficulty,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        pointsEarned = data.points_earned;
        setTotalPoints((prev) => prev + pointsEarned);

        // Update local progress
        setProgress((prev) => {
          const existing = prev.find((p) => p.key === key && p.shape === shape && p.scale === scale);
          if (existing) {
            return prev.map((p) =>
              p.key === key && p.shape === shape && p.scale === scale
                ? { ...p, bestScore: Math.max(p.bestScore ?? 0, scored.points) }
                : p
            );
          }
          return [...prev, { key, shape, scale, bestScore: scored.points }];
        });
      }
    }

    setResult({ ...scored, pointsEarned });
  };

  const handleRetry = () => {
    setSelected(new Set(prefilled));
    setResult(null);
  };

  const handleNext = () => {
    const combo = getNextCombo(progress);
    setKey(combo.key);
    setShape(combo.shape);
    setScale(combo.scale);
    setSelected(new Set(getPrefilledNotes(buildCorrectSet(combo.key, combo.shape, combo.scale), difficulty)));
    setResult(null);
  };

  const { rank, nextRank, nextRankPoints } = getRankInfo(totalPoints);
  const solved = progress.filter((p) => p.bestScore === 100).length;

  if (loading) return <div className="drill-page" style={{ color: "white" }}>Loading...</div>;

  return (
    <div className="drill-page">
      <Link to="/training" className="back">
        ← Back to Training
      </Link>

      <div className="drill-header">
        <div>
          <h1>Map the CAGED Scale</h1>
          <p>
            Map out the <strong>{SCALE_LABELS[scale]}</strong> scale in the key
            of <strong>{key}</strong> using the <strong>{shape} shape</strong>.
          </p>
        </div>
        <DrillStats
          solved={solved}
          total={35}
          points={totalPoints}
          rank={rank}
          nextRank={nextRank}
          nextRankPoints={nextRankPoints}
        />
      </div>

      <DrillFretboard
        selected={selected}
        prefilled={prefilled}
        onToggle={toggle}
        feedback={result?.feedback ?? null}
        difficulty={difficulty}
        correctPositions={correct}
      />

      <div className="drill-controls-wrapper">
        {!result ? (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={selected.size < correct.size}
          >
            Submit
          </button>
        ) : (
          <div className="drill-result">
            <span className="score">{result.points} pts</span>
            {!!result.pointsEarned && (
              <span className="points-earned">+{result.pointsEarned} points</span>
            )}
            <div className="try-again-container">
              <p>
                {result.points === 100
                  ? "Perfect!"
                  : result.points >= 70
                    ? "Nice work!"
                    : "Keep practicing!"}
              </p>
              <button className="retry-btn" onClick={handleRetry}>Try Again</button>
              {result.points === 100 && (
                <button className="retry-btn" onClick={handleNext}>Next</button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="drill-controls-wrapper">
        <DrillRoadmap
          progress={progress}
          currentKey={key}
          currentShape={shape}
          currentScale={scale}
        />
      </div>
    </div>
  );
};

export default CagedScalesDrill;
