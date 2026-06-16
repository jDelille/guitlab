import { getLicksForShape } from "../../constants/licks";
import type { ShapeName } from "../../constants/CagedChords";
import type { Scales } from "../../types/Scales";

interface LickControlProps {
  shape: ShapeName;
  scale: string;
  keyName: string;
  selectedLickId: string | null;
  onSelect: (id: string | null) => void;
}

export default function LickControl({
  shape,
  scale,
  keyName,
  selectedLickId,
  onSelect,
}: LickControlProps) {
  const licks = getLicksForShape(shape, scale as Scales, keyName);

  if (licks.length === 0) return null;

  return (
    <div className="audio-controls">
      {licks.map((lick) => (
        <button
          key={lick.id}
          className={selectedLickId === lick.id ? "active" : ""}
          onClick={() => onSelect(selectedLickId === lick.id ? null : lick.id)}
        >
          {lick.name}
        </button>
      ))}
    </div>
  );
}
