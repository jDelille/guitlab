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
  showDoubleStops: boolean;
  showScaleWithDoubleStops: boolean;
  setSettings: any;
}

const Chords = ({
  cagedChord,
  setCagedChord,
  keyName,
  setSettings,
  showAllCagedScales,
  showDoubleStops,
  showScaleWithDoubleStops,
}: ChordsProps) => {
  const shapes = getShapesForKey(keyName);

  return (
    <div className="chords">
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
          <Chord
            key={shape.shape}
            shape={shape}
            active={cagedChord}
            setActive={setCagedChord}
            showAllCagedScales={showAllCagedScales}
            showDoubleStops={showDoubleStops}
            showScaleWithDoubleStops={showScaleWithDoubleStops}
            setSettings={setSettings}
          />
        ))}
      </div>
    </div>
  );
};

export default Chords;
