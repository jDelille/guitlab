import { useState } from "react";
import Fretboard from "../components/fretboard/Fretboard";
import Chords from "../components/chords/Chords";
import Controls from "../components/controls/Controls";
import { type ShapeName } from "../constants/CagedChords";
import type { Scales } from "../types/Scales";
import { getLicksForShape } from "../constants/licks";
import { getPatternForKey, MINOR_145 } from "../constants/patterns";
import { useSettings } from "../context/SettingsContext";
import { usePlayScale } from "../hooks/usePlayScale";

type ActivePositions = { string: number; fret: number }[] | null;

const Home = () => {
  const [cagedChord, setCagedChord] = useState<ShapeName>("C");
  const [selectedShapes, setSelectedShapes] = useState<Set<ShapeName>>(
    new Set(["C"]),
  );
  const [showChordTones] = useState<boolean>(false);
  const [activePositions, setActivePositions] = useState<ActivePositions>(null);
  const [selectedLickId, setSelectedLickId] = useState<string | null>(null);

  const { settings, setSettings } = useSettings();

  usePlayScale({ cagedChord, selectedShapes, selectedLickId, setActivePositions });

  const handleShapeToggle = (shapeName: ShapeName) => {
    setCagedChord(shapeName);
    const next = new Set(selectedShapes);
    if (next.has(shapeName)) {
      if (next.size === 1) {
        return;
      }
      next.delete(shapeName);
    } else {
      next.add(shapeName);
    }
    setSelectedShapes(next);
    setSettings((s: any) => ({ ...s, showAllCagedScales: next.size === 5 }));
  };

  return (
    <div className="page-content">
      <Controls />
      <Fretboard
        cagedChord={cagedChord}
        selectedShapes={selectedShapes}
        showChordTones={showChordTones}
        activePositions={activePositions}
        lickNotes={
          settings.show145
            ? getPatternForKey(MINOR_145, settings.key).notes
            : selectedLickId
              ? (getLicksForShape(
                  cagedChord,
                  settings.scale as Scales,
                  settings.key,
                ).find((l) => l.id === selectedLickId)?.notes ?? null)
              : null
        }
      />
      <Chords
        selectedShapes={selectedShapes}
        onShapeToggle={handleShapeToggle}
      />
    </div>
  );
};

export default Home;
