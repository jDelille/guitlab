import { useEffect, useState } from "react";
import { Scale } from "tonal";
import Fretboard from "./components/fretboard/Fretboard";
import Navbar from "./components/navbar/Navbar";
import Chords from "./components/chords/Chords";
import Controls from "./components/controls/Controls";
import { playScale } from "./audio/playScale";
import { getShapesForKey, type ShapeName } from "./constants/CagedChords";
import type { Scales } from "./types/Scales";
import { chordNotesToPlayNotes, lickToPlayNotes } from "./audio/utils";
import { getLicksForShape } from "./constants/licks";
import PlayScale from "./components/controls/PlayScale";

const SCALE_DISPLAY: Record<string, string> = {
  majorPentatonic: "Major Pentatonic",
  majorScale: "Major Scale",
  arpeggio: "Arpeggio",
};

const SCALE_TONAL: Record<string, string> = {
  majorPentatonic: "major pentatonic",
  majorScale: "major",
  arpeggio: "major",
};

type NotePosition = { string: number; fret: number } | null;

function App() {
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

  const handleShowAllScales = (val: boolean) => {
    setShowAllScales(val);
  };

  const shapeData = getShapesForKey(settings.key)[cagedChord];
  const scaleNotes = shapeData[settings.scale as Scales].filter((n) => !n.isOctaveExtension);

  useEffect(() => {
    if (!settings.playScale) return;

    const activeLick = selectedLickId
      ? getLicksForShape(cagedChord, settings.scale as Scales, settings.key)
          .find((l) => l.id === selectedLickId)
      : null;

    const notes = activeLick
      ? lickToPlayNotes(activeLick.notes)
      : chordNotesToPlayNotes(scaleNotes);

    const direction = activeLick ? "asc" : settings.playScaleDirection;

    const onComplete = () => setSettings((s: any) => ({ ...s, playScale: false }));

    let cancel: (() => void) | undefined;
    let cleaned = false;

    playScale(notes, settings.playScaleBpm, direction, setActivePosition, onComplete).then((stop) => {
      if (cleaned) stop();
      else cancel = stop;
    });

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
    <div className="page">
      <div className="layout">
        <div className="page-content">
          <Navbar />
          {/* <Controls
            settings={settings}
            setSettings={setSettings}
            cagedChord={cagedChord}
            selectedLickId={selectedLickId}
            setSelectedLickId={setSelectedLickId}
          /> */}
          <div className="active">
            <h2>{settings.key} {SCALE_DISPLAY[settings.scale] ?? settings.scale}</h2>
            <p>{Scale.get(`${settings.key} ${SCALE_TONAL[settings.scale]}`).notes.join(" · ")}</p>
          </div>

          {/* <PlayScale settings={settings} setSettings={setSettings} /> */}

          <Fretboard
            keyName={settings.key}
            scale={settings.scale}
            cagedChord={cagedChord}
            showChordTones={showChordTones}
            settings={settings}
            activePosition={activePosition}
            lickNotes={
              selectedLickId
                ? getLicksForShape(cagedChord, settings.scale as Scales, settings.key)
                    .find((l) => l.id === selectedLickId)?.notes ?? null
                : null
            }
          />
          <Chords
            cagedChord={cagedChord}
            setCagedChord={setCagedChord}
            keyName={settings.key}
            showAll={showAllScales}
            setShowAll={handleShowAllScales}
            showAllCagedScales={settings.showAllCagedScales}
            setSettings={setSettings}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
