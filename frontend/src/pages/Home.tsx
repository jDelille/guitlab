import { useEffect, useRef, useState } from "react";
import Fretboard from "../components/fretboard/Fretboard";
import Chords from "../components/chords/Chords";
import Controls from "../components/controls/Controls";
import { playScale, playDoubleStops, playTriads } from "../audio/playScale";
import { getShapesForKey, type ShapeName } from "../constants/CagedChords";
import type { Scales } from "../types/Scales";
import { lickToPlayNotes, MIDI_TUNING } from "../audio/utils";
import { getLicksForShape } from "../constants/licks";
import { getDoubleStopsForKey } from "../constants/doubleStops";
import { getTriadsForKey, type CagedShape } from "../constants/triads";

type ActivePositions = { string: number; fret: number }[] | null;

const ALL_SHAPES: ShapeName[] = ["C", "A", "G", "E", "D"];

const Home = () => {
  const [cagedChord, setCagedChord] = useState<ShapeName>("C");
  const [selectedShapes, setSelectedShapes] = useState<Set<ShapeName>>(new Set(["C"]));
  const [showAllScales, setShowAllScales] = useState<boolean>(false);
  const [showChordTones] = useState<boolean>(false);
  const [activePositions, setActivePositions] = useState<ActivePositions>(null);
  const [selectedLickId, setSelectedLickId] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    key: "C",
    scale: "majorPentatonic",
    tuning: "standard",
    frets: 15,
    showNotes: false,
    showIntervals: true,
    showTriads: false,
    showAllCagedScales: false,
    showDoubleStops: false,
    showScaleWithDoubleStops: false,
    flipped: false,
    flipFretboard: false,
    flipStrings: false,
    playScale: false,
    playScaleBpm: 120,
    playScaleDirection: "asc",
  });

  const preAllShapesRef = useRef<Set<ShapeName>>(new Set(["C"]));
  const prevShowAllRef = useRef(false);

  useEffect(() => {
    const wasShowingAll = prevShowAllRef.current;
    const isShowingAll = settings.showAllCagedScales;
    prevShowAllRef.current = isShowingAll;

    if (!wasShowingAll && isShowingAll) {
      preAllShapesRef.current = new Set(selectedShapes);
      setSelectedShapes(new Set(ALL_SHAPES));
    } else if (wasShowingAll && !isShowingAll && selectedShapes.size === 5) {
      // Only restore if all shapes are still selected — means the button was toggled off,
      // not a shape being deselected (which already updated selectedShapes to < 5)
      setSelectedShapes(preAllShapesRef.current);
    }
  }, [settings.showAllCagedScales]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShapeToggle = (shapeName: ShapeName) => {
    setCagedChord(shapeName);
    const next = new Set(selectedShapes);
    if (next.has(shapeName)) {
      if (next.size === 1) return;
      next.delete(shapeName);
    } else {
      next.add(shapeName);
    }
    setSelectedShapes(next);
    // Mirror the all-selected state into showAllCagedScales
    setSettings((s: any) => ({ ...s, showAllCagedScales: next.size === 5 }));
  };

  useEffect(() => {
    if (!settings.playScale) return;

    const onComplete = () => setSettings((s: any) => ({ ...s, playScale: false }));
    let cancel: (() => void) | undefined;
    let cleaned = false;

    if (settings.showDoubleStops) {
      const pairs = [...getDoubleStopsForKey(settings.key)].sort((a, b) => {
        const minDiff = Math.min(...a.frets) - Math.min(...b.frets);
        return minDiff !== 0 ? minDiff : Math.max(...a.frets) - Math.max(...b.frets);
      });
      playDoubleStops(pairs, settings.playScaleBpm, setActivePositions, onComplete).then(
        (stop) => { if (cleaned) stop(); else cancel = stop; }
      );
    } else if (settings.showTriads) {
      const triads = [...getTriadsForKey(settings.key, cagedChord as CagedShape)].sort((a, b) =>
        Math.min(...a.frets) - Math.min(...b.frets)
      );
      playTriads(triads, settings.playScaleBpm, setActivePositions, onComplete).then(
        (stop) => { if (cleaned) stop(); else cancel = stop; }
      );
    } else {
      const activeLick = selectedLickId
        ? getLicksForShape(cagedChord, settings.scale as Scales, settings.key).find(
            (l) => l.id === selectedLickId,
          )
        : null;

      if (activeLick) {
        playScale(
          lickToPlayNotes(activeLick.notes),
          settings.playScaleBpm,
          "asc",
          (pos) => setActivePositions(pos ? [pos] : null),
          onComplete,
        ).then((stop) => { if (cleaned) stop(); else cancel = stop; });
      } else {
        // Play each shape in CAGED neck order, completing one shape before moving to the next
        const shapesToPlay = settings.showAllCagedScales
          ? ALL_SHAPES
          : ALL_SHAPES.filter((s) => selectedShapes.has(s));

        const notes: { midi: number; string: number; fret: number }[] = [];

        const toPlayNotes = (arr: any[]) =>
          arr
            .filter((n) => n.fret !== null)
            .map((n) => ({ midi: MIDI_TUNING[n.string] + n.fret!, string: n.string, fret: n.fret! }))
            .sort((a, b) => a.string !== b.string ? b.string - a.string : a.fret - b.fret);

        shapesToPlay.forEach((shapeName) => {
          const scaleData = getShapesForKey(settings.key)[shapeName][settings.scale as Scales];
          notes.push(...toPlayNotes(scaleData.filter((n) => !n.isOctaveExtension)));
        });

        playScale(
          notes,
          settings.playScaleBpm,
          "asc",
          (pos) => setActivePositions(pos ? [pos] : null),
          onComplete,
        ).then((stop) => { if (cleaned) stop(); else cancel = stop; });
      }
    }

    return () => {
      cleaned = true;
      cancel?.();
    };
  }, [
    settings.playScale,
    settings.playScaleBpm,
    settings.showDoubleStops,
    settings.showTriads,
    settings.showAllCagedScales,
    settings.key,
    settings.scale,
    cagedChord,
    selectedShapes,
    selectedLickId,
  ]);

  return (
    <div className="page-content">
      <Controls
        settings={settings}
        setSettings={setSettings}
        cagedChord={cagedChord}
        selectedLickId={selectedLickId}
        setSelectedLickId={setSelectedLickId}
      />
      <Fretboard
        keyName={settings.key}
        scale={settings.scale}
        cagedChord={cagedChord}
        selectedShapes={selectedShapes}
        showChordTones={showChordTones}
        settings={settings}
        activePositions={activePositions}
        lickNotes={
          selectedLickId
            ? (getLicksForShape(cagedChord, settings.scale as Scales, settings.key).find(
                (l) => l.id === selectedLickId,
              )?.notes ?? null)
            : null
        }
      />
      <Chords
        selectedShapes={selectedShapes}
        onShapeToggle={handleShapeToggle}
        keyName={settings.key}
        scale={settings.scale}
        showAll={showAllScales}
        setShowAll={setShowAllScales}
        showAllCagedScales={settings.showAllCagedScales}
        showDoubleStops={settings.showDoubleStops}
        showScaleWithDoubleStops={settings.showScaleWithDoubleStops}
        setSettings={setSettings}
      />
    </div>
  );
};

export default Home;
