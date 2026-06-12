import ControlGroup from "./ControlGroup";
import { FaPlay, FaStop } from "react-icons/fa";
import { Divider } from "./Controls";

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
    <ControlGroup label="Play Scale">
      <div className="play">
        {settings.playScale ? (
          <FaStop
            color="white"
            className="play-btn"
            onClick={() => set({ playScale: false })}
          />
        ) : (
          <FaPlay
            color="white"
            className="play-btn"
            onClick={() => set({ playScale: true })}
          />
        )}

        <div className="group">
          <input
            type="range"
            min={40}
            max={240}
            value={settings.playScaleBpm}
            onChange={(e) => set({ playScaleBpm: Number(e.target.value) })}
          />
          <p>{settings.playScaleBpm} BPM</p>
        </div>

        <Divider height={20} />

        <div className="audio-controls">
          {DIRECTIONS.map(({ label, value }) => (
            <button
              key={value}
              className={settings.playScaleDirection === value ? "active" : ""}
              onClick={() => set({ playScaleDirection: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </ControlGroup>
  );
};

export default PlayScale;
