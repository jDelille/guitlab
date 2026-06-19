import { useState } from "react";
import "./DrillRoadmap.scss";

const KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const SHAPES = ["C", "A", "G", "E", "D"];
const SCALES = ["majorPentatonic", "majorScale", "arpeggio"];
const SCALE_LABELS: Record<string, string> = {
  majorPentatonic: "Major Pent.",
  majorScale: "Major Scale",
  arpeggio: "Arpeggio",
};

const SHAPES_TO_UNLOCK_NEXT_KEY = 3;

interface ComboProgress {
  key: string;
  shape: string;
  scale: string;
  bestScore: number | null;
}

interface Props {
  progress: ComboProgress[];
  currentKey: string;
  currentShape: string;
  currentScale: string;
}

const DrillRoadmap = ({
  progress,
  currentKey,
  currentShape,
  currentScale,
}: Props) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([currentKey]));

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isCompleted = (key: string, shape: string, scale: string) =>
    progress.some(
      (p) =>
        p.key === key &&
        p.shape === shape &&
        p.scale === scale &&
        p.bestScore === 100,
    );

  const shapesCompletedForKey = (key: string) =>
    SHAPES.filter((shape) =>
      SCALES.every((scale) => isCompleted(key, shape, scale)),
    ).length;

  const isKeyUnlocked = (keyIndex: number) => {
    if (keyIndex === 0) return true;
    return (
      shapesCompletedForKey(KEYS[keyIndex - 1]) >= SHAPES_TO_UNLOCK_NEXT_KEY
    );
  };

  return (
    <div className="drill-roadmap">
      {KEYS.map((key, keyIndex) => {
        const unlocked = isKeyUnlocked(keyIndex);
        const isCurrent = key === currentKey;
        const isOpen = expanded.has(key) && unlocked;
        const completedShapes = shapesCompletedForKey(key);

        return (
          <div
            key={key}
            className={`roadmap-key ${isCurrent ? "current" : ""} ${!unlocked ? "locked" : ""}`}
          >
            <button
              className="roadmap-key__header"
              onClick={() => unlocked && toggle(key)}
              disabled={!unlocked}
            >
              <span className="roadmap-key__name">Key of {key}</span>
              <div className="roadmap-key__header-right">
                {!unlocked && (
                  <span className="roadmap-key__lock">
                    🔒 Complete {SHAPES_TO_UNLOCK_NEXT_KEY}/5 in{" "}
                    {KEYS[keyIndex - 1]}
                  </span>
                )}
                {unlocked && (
                  <span className="roadmap-key__progress">
                    {completedShapes}/{SHAPES.length} shapes
                  </span>
                )}
                {unlocked && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`roadmap-key__chevron ${isOpen ? "expanded" : ""}`}
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>

            {isOpen && (
              <div className="roadmap-key__shapes">
                {SHAPES.map((shape) => {
                  const isCurrentCombo = isCurrent && shape === currentShape;
                  const allScalesDone = SCALES.every((scale) =>
                    isCompleted(key, shape, scale),
                  );

                  return (
                    <div
                      key={shape}
                      className={`roadmap-shape ${isCurrentCombo ? "current" : ""} ${allScalesDone ? "completed" : ""}`}
                    >
                      <span className="roadmap-shape__name">{shape}</span>
                      <div className="roadmap-shape__scales">
                        {SCALES.map((scale) => {
                          const done = isCompleted(key, shape, scale);
                          const isCur =
                            isCurrentCombo && scale === currentScale;
                          return (
                            <span
                              key={scale}
                              className={`scale-pip ${done ? "done" : ""} ${isCur ? "active" : ""}`}
                            >
                              {done ? "✓" : "-"} {SCALE_LABELS[scale]}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DrillRoadmap;
