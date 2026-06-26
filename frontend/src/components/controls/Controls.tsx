import KeyControl from "./key-control/KeyControl";
import ScaleControl from "./scale-control/ScaleControl";
import OverlayControls from "./overlay-controls/OverlayControls";
import PlayScale from "./play-scale/PlayScale";
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

export default function Controls() {
  return (
    <div className="controls">
      <div className="keys">
        <p className="label">Key</p>
        <KeyControl notes={NOTES} />
      </div>

      <div className="flex">
        <div className="group">
          <p className="label">Scale / Arpeggio</p>
          <ScaleControl scales={SCALES} />
        </div>

        <div className="group-2">
          <p className="label">Overlay</p>
          <OverlayControls />
        </div>

        <div className="group">
          <p className="label">Playback</p>
          <PlayScale />
        </div>
      </div>
    </div>
  );
}
