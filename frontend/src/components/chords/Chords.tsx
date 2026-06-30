import { useEffect, useRef, useState } from "react";
import { getShapesForKey, type ShapeName } from "../../constants/CagedChords";
import Chord from "./chord/Chord";
import { useSettings } from "../../context/SettingsContext";
import "./Chords.scss";

interface ChordsProps {
  selectedShapes: Set<ShapeName>;
  onShapeToggle: (shape: ShapeName) => void;
}

const Chords = ({ selectedShapes, onShapeToggle }: ChordsProps) => {
  const { settings, setSettings } = useSettings();
  const [chordQuality, setChordQuality] = useState<"major" | "minor" | "dom7">("major");

  const SCALE_QUALITY_MAP: Record<string, { major: string; minor: string; dom7: string }> = {
    arpeggio:        { major: "arpeggio",        minor: "minorArpeggio",   dom7: "dom7Arpeggio" },
    majorPentatonic: { major: "majorPentatonic", minor: "minorPentatonic", dom7: "dom7Scale"    },
    majorScale:      { major: "majorScale",      minor: "minorScale",      dom7: "dom7Scale"    },
    minorArpeggio:   { major: "arpeggio",        minor: "minorArpeggio",   dom7: "dom7Arpeggio" },
    minorPentatonic: { major: "majorPentatonic", minor: "minorPentatonic", dom7: "dom7Scale"    },
    minorScale:      { major: "majorScale",      minor: "minorScale",      dom7: "dom7Scale"    },
    dom7Chord:       { major: "arpeggio",        minor: "minorArpeggio",   dom7: "dom7Chord"    },
    dom7Arpeggio:    { major: "arpeggio",        minor: "minorArpeggio",   dom7: "dom7Arpeggio" },
    dom7Scale:       { major: "majorScale",      minor: "minorScale",      dom7: "dom7Scale"    },
  };

  useEffect(() => {
    if (settings.scale.startsWith("dom7")) {
      setChordQuality("dom7");
    } else if (settings.scale.includes("minor") || settings.scale.includes("Minor")) {
      setChordQuality("minor");
    } else {
      setChordQuality("major");
    }
  }, [settings.scale]);

  const handleQualityChange = (quality: "major" | "minor" | "dom7") => {
    setChordQuality(quality);
    const mapped = SCALE_QUALITY_MAP[settings.scale]?.[quality];
    if (mapped) {
      setSettings((s: any) => ({ ...s, scale: mapped }));
    }
  };

  const shapes = getShapesForKey(settings.key);
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
    <div className="chords" id="tour-chords">
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chords;
