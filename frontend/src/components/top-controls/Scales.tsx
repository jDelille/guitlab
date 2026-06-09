import "./TopControls.scss";

interface ScalesProps {
  scale: string;
  setScale: (scale: string) => void;
}

const Scales = ({ scale, setScale }: ScalesProps) => {
  const scales = [
    "arpeggio",
    "majorPentatonic",
    "majorScale",
    // "minorChord",
    // "minorArpeggio",
    // "minorPentatonic",
    // "minorScale",
    // "dom7Chord",
    // "dom7Arpeggio",
    // "dom7Scale",
  ];

  return (
    <div className="scales">
      <label htmlFor="scale-select" className="label">
        Scale
      </label>

      <select
        id="scale-select"
        className="control"
        value={scale}
        onChange={(e) => setScale(e.target.value)}
      >
        {scales.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Scales;