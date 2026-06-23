import { useEffect, useRef, useState } from "react";
import { getShapesForKey, type ShapeName } from "../../constants/CagedChords";
import Chord from "./chord/Chord";
import "./Chords.scss";

interface ChordsProps {
  keyName: string;
  scale: string;
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
  scale,
  setSettings,
  showAllCagedScales,
  showDoubleStops,
  showScaleWithDoubleStops,
}: ChordsProps) => {
  const [chordQuality, setChordQuality] = useState<"major" | "minor" | "dom7">("major");

  // Maps each scale to its major and minor counterpart
  const SCALE_QUALITY_MAP: Record<string, { major: string; minor: string }> = {
    arpeggio:        { major: "arpeggio",        minor: "minorArpeggio"   },
    majorPentatonic: { major: "majorPentatonic", minor: "minorPentatonic" },
    majorScale:      { major: "majorScale",      minor: "minorScale"      },
    minorArpeggio:   { major: "arpeggio",        minor: "minorArpeggio"   },
    minorPentatonic: { major: "majorPentatonic", minor: "minorPentatonic" },
    minorScale:      { major: "majorScale",      minor: "minorScale"      },
  };

  useEffect(() => {
    if (scale.includes("minor") || scale.includes("Minor")) {
      setChordQuality("minor");
    } else {
      setChordQuality("major");
    }
  }, [scale]);

  const handleQualityChange = (quality: "major" | "minor" | "dom7") => {
    setChordQuality(quality);
    if (quality !== "dom7") {
      const mapped = SCALE_QUALITY_MAP[scale]?.[quality];
      if (mapped) setSettings((s: any) => ({ ...s, scale: mapped }));
    }
  };

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
    <div className="chords">
      <div className="chords-header">
        <p className="section-label">
          {chordQuality === "dom7" ? "Dom7 Chords" : `${chordQuality === "major" ? "Major" : "Minor"} CAGED Chords`}
        </p>
        <div className="quality-toggle">
          <button
            className={chordQuality === "major" ? "active" : ""}
            onClick={() => handleQualityChange("major")}
          >
            Major
          </button>
          <button
            className={chordQuality === "minor" ? "active" : ""}
            onClick={() => handleQualityChange("minor")}
          >
            Minor
          </button>
          <button
            className={chordQuality === "dom7" ? "active" : ""}
            onClick={() => handleQualityChange("dom7")}
          >
            Dom7
          </button>
        </div>
      </div>
      <p className="chords-hint">Click a shape to select it · click again to deselect</p>
      <div className="chord-row-scroll" ref={chordsRef} onMouseLeave={hideScrollbar}>
        <div className="chord-row">
          {Object.values(shapes).map((shape) => (
            <div key={shape.shape} onMouseEnter={showScrollbar}>
              <Chord
                shape={shape}
                selectedShapes={selectedShapes}
                onToggle={onShapeToggle}
                chordQuality={chordQuality}
                showAllCagedScales={showAllCagedScales}
                showDoubleStops={showDoubleStops}
                showScaleWithDoubleStops={showScaleWithDoubleStops}
                setSettings={setSettings}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chords;
