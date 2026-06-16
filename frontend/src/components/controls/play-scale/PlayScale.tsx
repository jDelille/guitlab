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
        <span>{settings.playScaleBpm} BPM</span>
      </div>

      <div className="play-scale__directions">
        {DIRECTIONS.map(({ label, value }) => (
          <button
            key={value}
            className={`play-scale__dir-btn ${settings.playScaleDirection === value ? "play-scale__dir-btn--active" : ""}`}
            onClick={() => set({ playScaleDirection: value })}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayScale;
