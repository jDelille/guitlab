import { useRef, useState, useEffect } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
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
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
  { label: "Both", value: "both" },
];

const PlayScale = ({ settings, setSettings }: PlayScaleProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const set = (patch: Partial<PlayScaleSettings>) =>
    setSettings((s: any) => ({ ...s, ...patch }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="play-scale__settings-wrapper" ref={menuRef}>
        <button
          className="play-scale__settings-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Playback settings"
        >
          <IoSettingsOutline size={15} />
        </button>

        {menuOpen && (
          <div className="play-scale__menu">
            <span className="play-scale__menu-label">Direction</span>
            <ul>
              {DIRECTIONS.map(({ label, value }) => (
                <li key={value}>
                  <button
                    className={settings.playScaleDirection === value ? "active" : ""}
                    onClick={() => {
                      set({ playScaleDirection: value });
                      setMenuOpen(false);
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayScale;
