import { useState } from "react";
import KeyControl from "./key-control/KeyControl";
import ScaleControl from "./scale-control/ScaleControl";
import TuningControl from "./tuning-control/TuningControl";
import FretNumberControl from "./FretNumberControl";
import OverlayControls from "./overlay-controls/OverlayControls";
import FlipFretboardControl from "./FlipFretboardControl";
import PlayScale from "./play-scale/PlayScale";
import type { ShapeName } from "../../constants/CagedChords";
import "./Controls.scss";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SCALES = ["arpeggio", "majorPentatonic", "majorScale"];

const TUNINGS = [
  "Standard (EADGBe)",
  "Drop D (DADGBe)",
  "Open G (DGDGBd)",
  "Open D (DADf#Ad)",
  "Open E (EBEg#Be)",
  "DADGAD",
  "Half Step Down",
  "Full Step Down",
];

const FRET_OPTIONS = [12, 15, 17, 20, 24];

type BluesBox = "none" | "bb" | "albert" | "both";

interface FretifyControlsState {
  key: string;
  scale: string;
  frets: number;
  tuning: string;
  showNotes: boolean;
  showIntervals: boolean;
  showTriads: boolean;
  bluesBox: BluesBox;
  flipped: boolean;
}

interface ControlsProps {
  settings: any;
  setSettings: any;
  cagedChord: ShapeName;
  selectedLickId: string | null;
  setSelectedLickId: (id: string | null) => void;
}

interface DividerProps {
  height?: number;
}

export function Divider({ height = 40 }: DividerProps) {
  return (
    <div
      style={{
        width: 1,
        height: height || 40,
        background: "#222",
        flexShrink: 0,
        alignSelf: "flex-end",
        marginBottom: 5,
      }}
    />
  );
}

export default function Controls({ settings, setSettings }: ControlsProps) {
  const [state, setState] = useState<FretifyControlsState>({
    key: "C",
    scale: "Major",
    frets: 15,
    tuning: "Standard (EADGBe)",
    showNotes: true,
    showIntervals: false,
    showTriads: false,
    bluesBox: "none",
    flipped: false,
  });

  const set = (patch: Partial<FretifyControlsState>) =>
    setState((s) => ({ ...s, ...patch }));

  return (
    <div className="controls">
      {/* <div className="row">

        <FretNumberControl
          state={state}
          fret_options={FRET_OPTIONS}
          set={set}
        />

        <Divider />

        <PlayScale settings={settings} setSettings={setSettings} />
      </div> */}

      <div className="row">
        <KeyControl
          notes={NOTES}
          settings={settings}
          setSettings={setSettings}
        />
      </div>

      <div className="flex">
        <ScaleControl
          scales={SCALES}
          settings={settings}
          setSettings={setSettings}
        />

        <TuningControl state={state} tunings={TUNINGS} set={set} />

        <PlayScale settings={settings} setSettings={setSettings} />
      </div>

      {/* <OverlayControls
        state={state}
        set={set}
        settings={settings}
        setSettings={setSettings}
      /> */}
    </div>
  );
}
