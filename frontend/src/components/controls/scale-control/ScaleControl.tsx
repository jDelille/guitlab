import { useState, useRef, useEffect } from "react";
import "./ScaleControl.scss";

interface ScaleControlProps {
  scales: string[];
  settings: any;
  setSettings: any;
}

const SCALE_LABELS: Record<string, string> = {
  arpeggio: "Arpeggio",
  majorPentatonic: "Major Pentatonic",
  majorScale: "Major Scale",
  minorArpeggio: "Minor Arpeggio",
  minorPentatonic: "Minor Pentatonic",
  minorScale: "Minor Scale",
  dom7Arpeggio: "Dom7 Arpeggio",
  dom7Scale: "Dom7 Scale",
};

const SCALE_SECTIONS = [
  {
    label: "Major",
    scales: ["arpeggio", "majorPentatonic", "majorScale"],
  },
  {
    label: "Minor",
    scales: ["minorArpeggio", "minorPentatonic", "minorScale"],
  },
  {
    label: "Dom7",
    scales: ["dom7Arpeggio", "dom7Scale"],
  },
];

const ScaleControl = ({ scales, settings, setSettings }: ScaleControlProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = (scale: string) => {
    setSettings((s: any) => ({ ...s, scale }));
    setOpen(false);
  };

  return (
    <div className="scale-control" ref={ref}>
      <button className="scale-control__trigger" onClick={() => setOpen(!open)}>
        <span>{SCALE_LABELS[settings.scale] ?? settings.scale}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`scale-control__chevron ${open ? "scale-control__chevron--open" : ""}`}
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="scale-control__menu">
          {SCALE_SECTIONS.map(({ label, scales: sectionScales }) => {
            const available = sectionScales.filter((s) => scales.includes(s));
            if (!available.length) return null;
            return (
              <div key={label} className="scale-control__section">
                <span className="scale-control__section-label">{label}</span>
                {available.map((scale) => (
                  <button
                    key={scale}
                    className={`scale-control__option ${settings.scale === scale ? "scale-control__option--active" : ""}`}
                    onClick={() => select(scale)}
                  >
                    {SCALE_LABELS[scale] ?? scale}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScaleControl;
