import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import type { ShapeName } from "../../constants/CagedChords";
import type { Scales } from "../../types/Scales";

import DrillFretboard from "../drill-fretboard/DrillFretboard";
import DrillRoadmap from "./DrillRoadmap";
import LoadingScreen from "../ui/LoadingScreen";
import { supabase } from "../../services/supabase";
import {
  DRILL_CONFIG,
  SCALE_LABELS,
  buildCorrectSet,
  scoreAnswer,
  getNextCombo,
  getPrefilledNotes,
  type ComboProgress,
} from "../../utils/drillUtils";
import "../../pages/Drill.scss";

const DrillPage = () => {
  const { drillId } = useParams<{ drillId: string }>();
  const config = drillId ? DRILL_CONFIG[drillId] : null;

  const [progress, setProgress] = useState<ComboProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty] = useState("Novice");

  const scales = config ? [config.scaleKey] : (["majorPentatonic"] as Scales[]);
  const next = getNextCombo([], scales);

  const [key, setKey] = useState<string>(next.key);
  const [shape, setShape] = useState<ShapeName>(next.shape);
  const [scale, setScale] = useState<Scales>(next.scale);

  const correct = useMemo(() => buildCorrectSet(key, shape, scale), [key, shape, scale]);
  const prefilled = useMemo(() => getPrefilledNotes(correct, difficulty), [correct, difficulty]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(prefilled));
  const [result, setResult] = useState<(ReturnType<typeof scoreAnswer> & { pointsEarned?: number }) | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const progressRes = await fetch(`${import.meta.env.VITE_API_URL}/drill-progress`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (progressRes.ok) {
        const data = await progressRes.json();
        const mapped: ComboProgress[] = data.map((r: any) => ({
          key: r.key,
          shape: r.shape,
          scale: r.scale,
          bestScore: r.best_score,
        }));
        setProgress(mapped);
        const combo = getNextCombo(mapped, scales);
        setKey(combo.key);
        setShape(combo.shape);
        setScale(combo.scale);
        setSelected(new Set(getPrefilledNotes(buildCorrectSet(combo.key, combo.shape, combo.scale), difficulty)));
      }

      setLoading(false);
    }

    fetchProgress();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/drill-progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ drill_id: drillId, key, shape, scale, score: scored.points, difficulty }),
      });
      if (res.ok) {
        const data = await res.json();
        pointsEarned = data.points_earned;
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
    const combo = getNextCombo(progress, scales);
    setKey(combo.key);
    setShape(combo.shape);
    setScale(combo.scale);
    setSelected(new Set(getPrefilledNotes(buildCorrectSet(combo.key, combo.shape, combo.scale), difficulty)));
    setResult(null);
  };

  if (loading) return <LoadingScreen />;

  if (!config) {
    return (
      <div className="drill-page">
        <Link to="/training" className="back">← Back</Link>
        <p style={{ color: "white", marginTop: "2rem" }}>Drill not found.</p>
      </div>
    );
  }

  const scaleLabels = { [config.scaleKey]: SCALE_LABELS[config.scaleKey] ?? config.label };
  const solved = progress.filter(p => p.scale === config.scaleKey && p.bestScore === 100).length;
  const drillComplete = solved === 35;

  return (
    <div className="drill-page">
      <Link to="/training" className="back">← Back</Link>

      <div className="drill-header">
        <div>
          <h1>{config.label}</h1>
          <p>{config.prompt(key, shape)}.</p>
        </div>
        {drillComplete && (
          <div className="drill-complete-badge">
            <span>✓</span> Drill Complete — {solved}/35
          </div>
        )}
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
          <button className="submit-btn" onClick={handleSubmit} disabled={selected.size < correct.size}>
            Submit
          </button>
        ) : (
          <div className="drill-result">
            <span className="score">{result.points} pts</span>
            {!!result.pointsEarned && <span className="points-earned">+{result.pointsEarned} points</span>}
            <div className="try-again-container">
              <p>{result.points === 100 ? "Perfect!" : result.points >= 70 ? "Nice work!" : "Keep practicing!"}</p>
              <button className="retry-btn" onClick={handleRetry}>Try Again</button>
              {result.points === 100 && <button className="retry-btn" onClick={handleNext}>Next</button>}
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
          scales={scales}
          scaleLabels={scaleLabels}
        />
      </div>
    </div>
  );
};

export default DrillPage;
