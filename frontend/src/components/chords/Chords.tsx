import { useRef } from "react";
import { getShapesForKey, type ShapeName } from "../../constants/CagedChords";
import Chord from "./chord/Chord";
import "./Chords.scss";

interface ChordsProps {
  keyName: string;
  selectedShapes: Set<ShapeName>;
  onShapeToggle: (shape: ShapeName) => void;
  showAll: boolean;
  setShowAll: (val: boolean) => void;
  showAllCagedScales: boolean;
  showDoubleStops: boolean;
  showScaleWithDoubleStops: boolean;
  setSettings: any;
}

const Chords = ({
  selectedShapes,
  onShapeToggle,
  keyName,
  setSettings,
  showAllCagedScales,
  showDoubleStops,
  showScaleWithDoubleStops,
}: ChordsProps) => {
  const shapes = getShapesForKey(keyName);
  const chordsRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showScrollbar = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    chordsRef.current?.classList.add("scrollbar-visible");
  };

  const hideScrollbar = () => {
    hideTimer.current = setTimeout(() => {
      chordsRef.current?.classList.remove("scrollbar-visible");
    }, 800);
  };

  return (
    <div className="chords" ref={chordsRef} onMouseLeave={hideScrollbar}>
      {/* <div className="chords-header">
        <button
          className="play-chord-btn"
          onClick={() => playChord(activeShape.notes)}
        >
          <FaPlay size={10} />
          Play Chord
        </button>
      </div> */}
      <div className="chord-row">
        {Object.values(shapes).map((shape) => (
          <div key={shape.shape} onMouseEnter={showScrollbar}>
            <Chord
              shape={shape}
              selectedShapes={selectedShapes}
              onToggle={onShapeToggle}
              showAllCagedScales={showAllCagedScales}
              showDoubleStops={showDoubleStops}
              showScaleWithDoubleStops={showScaleWithDoubleStops}
              setSettings={setSettings}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chords;
