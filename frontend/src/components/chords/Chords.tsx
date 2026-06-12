import { useState } from "react";
import { getShapesForKey, type ShapeName } from "../../constants/CagedChords";
import Chord from "./chord/Chord";
import "./Chords.scss";

interface ChordsProps {
  keyName: string;
  cagedChord: string;
  setCagedChord: React.Dispatch<React.SetStateAction<ShapeName>>;
  showAll: boolean;
  setShowAll: (val: boolean) => void;
  showAllCagedScales: boolean;
  setSettings: any;
}

const Chords = ({
  cagedChord,
  setCagedChord,
  keyName,
  setSettings,
  showAllCagedScales,
}: ChordsProps) => {
  const [active, setActive] = useState<ShapeName>("C");
  const shapes = getShapesForKey(keyName); // was hardcoded "C"

  return (
    <div className="chords">
      <div className="chord-row">
        {Object.values(shapes).map((shape) => (
          <Chord
            key={shape.shape}
            shape={shape}
            active={cagedChord}
            setActive={setCagedChord}
            showAllCagedScales={showAllCagedScales}
            setSettings={setSettings}
          />
        ))}
      </div>
    </div>
  );
};

export default Chords;
