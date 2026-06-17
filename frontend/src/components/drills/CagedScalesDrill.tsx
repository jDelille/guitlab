import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { ShapeName } from "../../constants/CagedChords";
import type { Scales } from "../../types/Scales";

import DrillFretboard from "../drill-fretboard/DrillFretboard";
import DrillStats from "./DrillStats";
import DrillRoadmap from "./DrillRoadmap";
import {
  SCALE_LABELS,
  buildCorrectSet,
  scoreAnswer,
  getNextCombo,
  getPrefilledNotes,
  type ComboProgress,
} from "../../utils/drillUtils";
import "../../pages/Drill.scss";

const mockProgress: ComboProgress[] = [
  { key: "C", shape: "C", scale: "majorPentatonic", bestScore: 100 },
  { key: "C", shape: "C", scale: "majorScale", bestScore: 100 },
  { key: "C", shape: "C", scale: "arpeggio", bestScore: 100 },
  { key: "C", shape: "A", scale: "majorPentatonic", bestScore: 100 },
  { key: "C", shape: "A", scale: "majorScale", bestScore: 72 },
];

const CagedScalesDrill = () => {
  const next = getNextCombo(mockProgress);
  const [key, setKey] = useState<string>(next.key);
  const [shape, setShape] = useState<ShapeName>(next.shape);
  const [difficulty, setDifficulty] = useState("Novice");
  const [scale, setScale] = useState<Scales>(next.scale);

  const correct = useMemo(() => buildCorrectSet(key, shape, scale), [key, shape, scale]);
  const prefilled = useMemo(() => getPrefilledNotes(correct, difficulty), [correct, difficulty]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set(prefilled));
  const [result, setResult] = useState<ReturnType<typeof scoreAnswer> | null>(null);

  const reset = () => {
    setSelected(new Set(getPrefilledNotes(buildCorrectSet(key, shape, scale), difficulty)));
    setResult(null);
  };

  const toggle = (k: string) => {
    if (prefilled.has(k)) return;
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
          solved={7}
          total={35}
          points={320}
          rank="Novice"
          nextRank="Bedroom Guitarist"
          nextRankPoints={500}
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
            onClick={() => setResult(scoreAnswer(selected, correct))}
            disabled={selected.size === 0}
          >
            Submit
          </button>
        ) : (
          <div className="drill-result">
            <span className="score">{result.points} pts</span>
            <div className="try-again-container">
              <p>
              {result.points === 100
                ? "Perfect!"
                : result.points >= 70
                  ? "Nice work!"
                  : "Keep practicing!"}
            </p>
            <button className="retry-btn" onClick={handleRetry}>
              Try Again
            </button>
            </div>
          </div>
        )}
      </div>

      <div className="drill-controls-wrapper">
        <DrillRoadmap
          progress={mockProgress}
          currentKey={key}
          currentShape={shape}
          currentScale={scale}
        />
      </div>
    </div>
  );
};

export default CagedScalesDrill;
