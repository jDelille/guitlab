import { useState } from "react";
import { getShapesForKey, type ShapeName } from "../../constants/CagedChords";
import Chord from "./chord/Chord";
import "./Chords.scss";

interface ChordsProps {
  keyName: string;
  cagedChord: string;
  setCagedChord: (chord: string) => void;
  showAll: boolean;
  setShowAll: (val: boolean) => void;
}

const Chords = ({
  cagedChord,
  setCagedChord,
  keyName,
  showAll,
  setShowAll,
}: ChordsProps) => {
  const [active, setActive] = useState<ShapeName>("C");
  const shapes = getShapesForKey(keyName); // was hardcoded "C"

  return (
    <div className="chords">
      {/* <div className="section-label">
        <p>CAGED Shapes -</p>

        <button
          className={`show-all-btn ${showAll ? "activeBtn" : ""}`}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Shape" : "Show All"}
        </button>
      </div> */}

      <div className="chord-row">
        {Object.values(shapes).map((shape) => (
          <Chord
            key={shape.shape}
            shape={shape}
            active={cagedChord}
            setActive={setCagedChord}
          />
        ))}
      </div>
    </div>
  );
};

export default Chords;
