import KeyControl from "./key-control/KeyControl";
import ScaleControl from "./scale-control/ScaleControl";
import OverlayControls from "./overlay-controls/OverlayControls";
import PlayScale from "./play-scale/PlayScale";
import type { ShapeName } from "../../constants/CagedChords";
import "./Controls.scss";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALES = [
  "arpeggio",
  "majorPentatonic",
  "majorScale",
  "minorArpeggio",
  "minorPentatonic",
  "minorScale",
  "dom7Chord",
  "dom7Arpeggio",
  "dom7Scale",
];

interface ControlsProps {
  settings: any;
  setSettings: any;
  cagedChord: ShapeName;
  selectedLickId: string | null;
  setSelectedLickId: (id: string | null) => void;
}

export default function Controls({ settings, setSettings }: ControlsProps) {
  return (
    <div className="controls">
      <div className="keys">
        <p className="label">Key</p>
        <KeyControl
          notes={NOTES}
          settings={settings}
          setSettings={setSettings}
        />
      </div>

      <div className="flex">
        <div className="group">
          <p className="label">Scale / Arpeggio</p>
          <ScaleControl
            scales={SCALES}
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        <div className="group-2">
          <p className="label">Overlay</p>
          <OverlayControls settings={settings} setSettings={setSettings} />
        </div>

        <div className="group">
          <p className="label">Play Scale / Metronome</p>
          <PlayScale settings={settings} setSettings={setSettings} />
        </div>
      </div>
    </div>
  );
}
