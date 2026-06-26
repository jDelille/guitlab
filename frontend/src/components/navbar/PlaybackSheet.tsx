import { useEffect, useRef, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { GiMetronome } from "react-icons/gi";
import { TbMusic, TbMusicPause } from "react-icons/tb";
import { useSettings } from "../../context/SettingsContext";
import type { BackingTrack } from "../controls/play-scale/BackingTrackModal";
import "./PlaybackSheet.scss";

const ANIM_MS = 280;

const DIRECTIONS = [
  { label: "Asc", value: "asc" },
  { label: "Desc", value: "desc" },
  { label: "Both", value: "both" },
] as const;

interface Props {
  onClose: () => void;
  onOpenBackingTrack: () => void;
  activeTrack: BackingTrack | null;
}

const PlaybackSheet = ({ onClose, onOpenBackingTrack, activeTrack }: Props) => {
  const [closing, setClosing] = useState(false);
  const [metronomeActive, setMetronomeActive] = useState(false);

  const { settings, setSettings } = useSettings();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, ANIM_MS);
  };

  const tick = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  };

  const stopMetronome = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = null;
    activeRef.current = false;
    setMetronomeActive(false);
  };

  const startMetronome = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    tick();
    intervalRef.current = window.setInterval(
      tick,
      (60 / settings.playScaleBpm) * 1000,
    );
    activeRef.current = true;
    setMetronomeActive(true);
  };

  const toggleMetronome = () =>
    activeRef.current ? stopMetronome() : startMetronome();

  useEffect(() => {
    if (!activeRef.current) return;
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    tick();
    intervalRef.current = window.setInterval(
      tick,
      (60 / settings.playScaleBpm) * 1000,
    );
  }, [settings.playScaleBpm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopMetronome(), []);

  const setBpm = (val: number) =>
    setSettings((s: any) => ({
      ...s,
      playScaleBpm: Math.max(40, Math.min(240, val)),
    }));

  return (
    <>
      <div
        className={`playback-sheet-overlay${closing ? " playback-sheet-overlay--closing" : ""}`}
        onClick={close}
      />
      <div
        className={`playback-sheet${closing ? " playback-sheet--closing" : ""}`}
      >
        <div className="playback-sheet__handle" />

        <div className="playback-sheet__play-row">
          <button
            className={`playback-sheet__play-btn${settings.playScale ? " playback-sheet__play-btn--active" : ""}`}
            onClick={() =>
              setSettings((s: any) => ({ ...s, playScale: !s.playScale }))
            }
          >
            {settings.playScale ? <FaStop size={16} /> : <FaPlay size={16} />}
            <span>{settings.playScale ? "Stop" : "Play"}</span>
          </button>

          <div className="playback-sheet__directions">
            {DIRECTIONS.map(({ label, value }) => (
              <button
                key={value}
                className={`playback-sheet__dir-btn${settings.playScaleDirection === value ? " playback-sheet__dir-btn--active" : ""}`}
                onClick={() =>
                  setSettings((s: any) => ({ ...s, playScaleDirection: value }))
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="playback-sheet__bpm-section">
          <div className="playback-sheet__bpm-row">
            <button
              className="playback-sheet__bpm-step"
              onClick={() => setBpm(settings.playScaleBpm - 5)}
            >
              −
            </button>
            <input
              type="range"
              min={40}
              max={240}
              value={settings.playScaleBpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="playback-sheet__slider"
            />
            <button
              className="playback-sheet__bpm-step"
              onClick={() => setBpm(settings.playScaleBpm + 5)}
            >
              +
            </button>
          </div>
          <span className="playback-sheet__bpm-val">
            {settings.playScaleBpm} BPM
          </span>
        </div>

        <div className="playback-sheet__actions">
          <button
            className={`playback-sheet__action-btn${metronomeActive ? " playback-sheet__action-btn--active" : ""}`}
            onClick={toggleMetronome}
          >
            <GiMetronome size={22} />
            <span>Metronome</span>
          </button>

          <button
            className={`playback-sheet__action-btn${activeTrack ? " playback-sheet__action-btn--active" : ""}`}
            onClick={onOpenBackingTrack}
          >
            {activeTrack ? <TbMusicPause size={22} /> : <TbMusic size={22} />}
            <span>Backing Track</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaybackSheet;
