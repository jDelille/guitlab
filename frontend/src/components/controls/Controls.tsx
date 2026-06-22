import KeyControl from "./key-control/KeyControl";
import ScaleControl from "./scale-control/ScaleControl";
import OverlayControls from "./overlay-controls/OverlayControls";
import PlayScale from "./play-scale/PlayScale";
import type { ShapeName } from "../../constants/CagedChords";
import "./Controls.scss";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALES = ["arpeggio", "majorPentatonic", "majorScale"];

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
        <KeyControl
          notes={NOTES}
          settings={settings}
          setSettings={setSettings}
        />
      </div>

      <div className="flex">
        <div className="flex-row">
          <ScaleControl
          scales={SCALES}
          settings={settings}
          setSettings={setSettings}
        />
        <OverlayControls settings={settings} setSettings={setSettings} />
        </div>

        <PlayScale settings={settings} setSettings={setSettings} />
      </div>

    </div>
  );
}
