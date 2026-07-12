import { useState, useEffect } from "react";
import Fretboard from "../components/fretboard/Fretboard";
import Chords from "../components/chords/Chords";
import Controls from "../components/controls/Controls";
import { type ShapeName } from "../constants/CagedChords";
import type { Scales } from "../types/Scales";
import { getLicksForShape } from "../constants/licks";
import { useSettings } from "../context/SettingsContext";
import { usePlayScale } from "../hooks/usePlayScale";
import { maybeStartTour } from "../tour/tour";
import "../tour/tour.scss";

export type ActivePositions = { string: number; fret: number }[] | null;

const Home = () => {
  const [cagedChord, setCagedChord] = useState<ShapeName>("C");
  const [selectedShapes, setSelectedShapes] = useState<Set<ShapeName>>(
    new Set(["C"]),
  );
  const [showChordTones] = useState<boolean>(false);
  const [activePositions, setActivePositions] = useState<ActivePositions>(null);
  const [selectedLickId] = useState<string | null>("e-major-blues-approach");

  const { settings, setSettings } = useSettings();


  useEffect(() => {
    maybeStartTour();
  }, []);

  const handleShapeToggle = (shapeName: ShapeName) => {
    console.log("TOGGLE SHAPE:", shapeName);

    setCagedChord(shapeName);
    const next = new Set(selectedShapes);
    if (next.has(shapeName)) {
      if (next.size === 1) return;
      next.delete(shapeName);
    } else {
      next.add(shapeName);
    }
    setSelectedShapes(next);
    setSettings((s: any) => ({ ...s, showAllCagedScales: next.size === 5 }));
  };

  useEffect(() => {
    console.log("CURRENT CAGED CHORD:", cagedChord);
  }, [cagedChord]);

  return (
    <div className="page-content">
      <Controls />
      <Fretboard
        cagedChord={cagedChord}
        selectedShapes={selectedShapes}
        showChordTones={showChordTones}
        setActivePositions={setActivePositions}
        activePositions={activePositions}
        activeLick={
          selectedLickId
            ? (getLicksForShape(
                cagedChord,
                settings.scale as Scales,
                settings.key,
              ).find((l) => l.id === selectedLickId) ?? null)
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
