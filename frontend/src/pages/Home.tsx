import { useEffect, useState } from "react";
import Fretboard from "../components/fretboard/Fretboard";
import Chords from "../components/chords/Chords";
import Controls from "../components/controls/Controls";
import { playScale } from "../audio/playScale";
import { getShapesForKey, type ShapeName } from "../constants/CagedChords";
import type { Scales } from "../types/Scales";
import { chordNotesToPlayNotes, lickToPlayNotes } from "../audio/utils";
import { getLicksForShape } from "../constants/licks";

type NotePosition = { string: number; fret: number } | null;

const Home = () => {
  const [cagedChord, setCagedChord] = useState<ShapeName>("C");
  const [showAllScales, setShowAllScales] = useState<boolean>(false);
  const [showChordTones, setShowChordTones] = useState<boolean>(false);
  const [activePosition, setActivePosition] = useState<NotePosition>(null);
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
    flipped: false,
    flipFretboard: false,
    flipStrings: false,
    playScale: false,
    playScaleBpm: 120,
    playScaleDirection: "asc",
  });

  const shapeData = getShapesForKey(settings.key)[cagedChord];
  const scaleNotes = shapeData[settings.scale as Scales].filter(
    (n) => !n.isOctaveExtension,
  );

  useEffect(() => {
    if (!settings.playScale) return;

    const activeLick = selectedLickId
      ? getLicksForShape(cagedChord, settings.scale as Scales, settings.key).find(
          (l) => l.id === selectedLickId,
        )
      : null;

    const notes = activeLick
      ? lickToPlayNotes(activeLick.notes)
      : chordNotesToPlayNotes(scaleNotes);

    const direction = activeLick ? "asc" : settings.playScaleDirection;
    const onComplete = () => setSettings((s: any) => ({ ...s, playScale: false }));

    let cancel: (() => void) | undefined;
    let cleaned = false;

    playScale(notes, settings.playScaleBpm, direction, setActivePosition, onComplete).then(
      (stop) => {
        if (cleaned) stop();
        else cancel = stop;
      },
    );

    return () => {
      cleaned = true;
      cancel?.();
    };
  }, [
    settings.playScale,
    settings.playScaleBpm,
    settings.playScaleDirection,
    settings.key,
    settings.scale,
    cagedChord,
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
        showChordTones={showChordTones}
        settings={settings}
        activePosition={activePosition}
        lickNotes={
          selectedLickId
            ? (getLicksForShape(cagedChord, settings.scale as Scales, settings.key).find(
                (l) => l.id === selectedLickId,
              )?.notes ?? null)
            : null
        }
      />
      <Chords
        cagedChord={cagedChord}
        setCagedChord={setCagedChord}
        keyName={settings.key}
        showAll={showAllScales}
        setShowAll={setShowAllScales}
        showAllCagedScales={settings.showAllCagedScales}
        setSettings={setSettings}
      />
    </div>
  );
};

export default Home;
