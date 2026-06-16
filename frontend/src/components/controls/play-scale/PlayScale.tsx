import { FaPlay, FaStop } from "react-icons/fa";
import "./PlayScale.scss";

type Direction = "asc" | "desc" | "both";

interface PlayScaleSettings {
  playScale: boolean;
  playScaleBpm: number;
  playScaleDirection: Direction;
}

interface PlayScaleProps {
  settings: PlayScaleSettings;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
}

const DIRECTIONS: { label: string; value: Direction }[] = [
  { label: "Asc", value: "asc" },
  { label: "Desc", value: "desc" },
  { label: "Both", value: "both" },
];

const PlayScale = ({ settings, setSettings }: PlayScaleProps) => {
  const set = (patch: Partial<PlayScaleSettings>) =>
    setSettings((s: any) => ({ ...s, ...patch }));

  return (
    <div className="play-scale">
      <button
        className="play-scale__btn"
        onClick={() => set({ playScale: !settings.playScale })}
      >
        {settings.playScale ? <FaStop size={12} /> : <FaPlay size={12} />}
      </button>


      <div className="play-scale__bpm">
        <input
          type="range"
          min={40}
          max={240}
          value={settings.playScaleBpm}
          onChange={(e) => set({ playScaleBpm: Number(e.target.value) })}
        />
        <span >{settings.playScaleBpm} BPM</span>
      </div>

      <select
        className="play-scale__direction-select"
        value={settings.playScaleDirection}
        onChange={(e) => set({ playScaleDirection: e.target.value as Direction })}
      >
        {DIRECTIONS.map(({ label, value }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
};

export default PlayScale;
