import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Scales } from "../../types/Scales";
import DrillFretboard from "../drill-fretboard/DrillFretboard";
import {
  DRILL_KEYS,
  DRILL_SHAPES,
  SCALE_LABELS,
  randomItem,
  buildCorrectSet,
  scoreAnswer,
} from "../../utils/drillUtils";
import "../../pages/Drill.scss";

const CagedScalesDrill = () => {
  const [key] = useState(() => randomItem(DRILL_KEYS));
  const [shape] = useState(() => randomItem(DRILL_SHAPES));
  const scale: Scales = "majorPentatonic";

  const correct = useMemo(() => buildCorrectSet(key, shape, scale), [key, shape]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ReturnType<typeof scoreAnswer> | null>(null);

  const toggle = (k: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  const handleRetry = () => {
    setSelected(new Set());
    setResult(null);
  };

  return (
    <div className="drill-page">
      <Link to="/training" className="back">← Back to Training</Link>

      <div className="drill-header">
        <h1>Map the CAGED Scale</h1>
        <p>
          Map out the <strong>{SCALE_LABELS[scale]}</strong> scale in the key of{" "}
          <strong>{key}</strong> using the <strong>{shape} shape</strong>.
        </p>
      </div>

      <DrillFretboard
        selected={selected}
        onToggle={toggle}
        feedback={result?.feedback ?? null}
      />

      <div className="drill-actions">
        {!result ? (
          <button className="submit-btn" onClick={() => setResult(scoreAnswer(selected, correct))} disabled={selected.size === 0}>
            Submit
          </button>
        ) : (
          <div className="drill-result">
            <span className="score">{result.points} pts</span>
            <p>
              {result.points === 100 ? "Perfect!" : result.points >= 70 ? "Nice work!" : "Keep practicing!"}
            </p>
            <button className="retry-btn" onClick={handleRetry}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CagedScalesDrill;
