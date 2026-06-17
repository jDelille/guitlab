import { useState, useRef, useEffect } from "react";
import type { ShapeName } from "../../constants/CagedChords";
import "./DrillControls.scss";

const KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const SHAPES: ShapeName[] = ["C", "A", "G", "E", "D"];
const DIFFICULTIES = ["Novice", "Intermediate", "Advanced", "Expert"];
const SCALE_OPTIONS = [
  { value: "majorPentatonic", label: "Major Pentatonic" },
  { value: "majorScale", label: "Major Scale" },
  { value: "arpeggio", label: "Arpeggio" },
];

interface DropdownOption {
  value: string;
  label: string;
  progress?: string;
}

interface Props {
  selectedKey: string;
  selectedShape: ShapeName;
  selectedDifficulty: string;
  selectedScale: string;
  keyProgress: Record<string, string>;
  shapeProgress: Record<string, string>;
  scaleProgress: Record<string, string>;
  onKeyChange: (key: string) => void;
  onShapeChange: (shape: ShapeName) => void;
  onDifficultyChange: (difficulty: string) => void;
  onScaleChange: (scale: string) => void;
}

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="drill-dropdown" ref={ref}>
      <button className="drill-dropdown__trigger" onClick={() => setOpen(!open)}>
        <span>{selected?.label ?? value}</span>
        <div className="drill-dropdown__trigger-right">
          {selected?.progress && <span className="drill-dropdown__progress">{selected.progress}</span>}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`drill-dropdown__chevron ${open ? "drill-dropdown__chevron--open" : ""}`}>
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="drill-dropdown__menu">
          {options.map((o) => (
            <button
              key={o.value}
              className={`drill-dropdown__option ${value === o.value ? "drill-dropdown__option--active" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              <span>{o.label}</span>
              {o.progress && <span className="drill-dropdown__progress">{o.progress}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const DrillControls = ({
  selectedKey, selectedShape, selectedDifficulty, selectedScale,
  keyProgress, shapeProgress, scaleProgress,
  onKeyChange, onShapeChange, onDifficultyChange, onScaleChange,
}: Props) => {
  const keyOptions = KEYS.map((k) => ({ value: k, label: k, progress: keyProgress[k] }));
  const shapeOptions = SHAPES.map((s) => ({ value: s, label: `${s} Shape`, progress: shapeProgress[s] }));
  const scaleOptions = SCALE_OPTIONS.map((s) => ({ value: s.value, label: s.label, progress: scaleProgress[s.value] }));
  const difficultyOptions = DIFFICULTIES.map((d) => ({ value: d, label: d }));

  return (
    <div className="drill-controls">
      <div className="drill-control">
        <span className="drill-control__label">Key</span>
        <Dropdown value={selectedKey} options={keyOptions} onChange={onKeyChange} />
      </div>
      <div className="drill-control">
        <span className="drill-control__label">Shape</span>
        <Dropdown value={selectedShape} options={shapeOptions} onChange={(v) => onShapeChange(v as ShapeName)} />
      </div>
      <div className="drill-control">
        <span className="drill-control__label">Scale</span>
        <Dropdown value={selectedScale} options={scaleOptions} onChange={onScaleChange} />
      </div>
      <div className="drill-control">
        <span className="drill-control__label">Difficulty</span>
        <Dropdown value={selectedDifficulty} options={difficultyOptions} onChange={onDifficultyChange} />
      </div>
    </div>
  );
};

export default DrillControls;
