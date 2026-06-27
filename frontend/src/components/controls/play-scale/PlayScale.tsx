import { useRef, useState, useEffect } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbMusic, TbMusicPause } from "react-icons/tb";
import { GiMetronome } from "react-icons/gi";
import { MdMusicNote } from "react-icons/md";
import InstrumentPicker, { INSTRUMENTS } from "./InstrumentPicker";
import BackingTrackModal, { type BackingTrack } from "./BackingTrackModal";
import FloatingPlayer from "./FloatingPlayer";
import { getCurrentInstrumentName } from "../../../audio/soundfont";
import "./PlayScale.scss";
import { useSettings } from "../../../context/SettingsContext";
import { PiMetronomeBold } from "react-icons/pi";

type Direction = "asc" | "desc" | "both";
type MetronomeSound = "click" | "wood" | "soft";

interface PlayScaleSettings {
  playScale: boolean;
  playScaleBpm: number;
  playScaleDirection: Direction;
  key: string;
}

const DIRECTIONS: { label: string; value: Direction }[] = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
  { label: "Both", value: "both" },
];

const SOUNDS: {
  label: string;
  value: MetronomeSound;
  freq: number;
  type: OscillatorType;
  decay: number;
}[] = [
  { label: "Click", value: "click", freq: 1000, type: "sine", decay: 0.04 },
  { label: "Wood", value: "wood", freq: 250, type: "triangle", decay: 0.08 },
  { label: "Soft", value: "soft", freq: 600, type: "sine", decay: 0.1 },
];

const PlayScale = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bpmOpen, setBpmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<BackingTrack | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(getCurrentInstrumentName);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [metronomeVolume, setMetronomeVolume] = useState(0.3);
  const [metronomeSound, setMetronomeSound] = useState<MetronomeSound>("click");

  const { settings, setSettings } = useSettings();

  const menuRef = useRef<HTMLDivElement>(null);
  const bpmRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<number | null>(null);
  const metronomeActiveRef = useRef(false);
  const metronomeSoundRef = useRef<MetronomeSound>("click");
  const metronomeVolumeRef = useRef(0.3);

  const set = (patch: Partial<PlayScaleSettings>) =>
    setSettings((s: any) => ({ ...s, ...patch }));

  const tick = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const soundDef = SOUNDS.find((s) => s.value === metronomeSoundRef.current) ?? SOUNDS[0];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = soundDef.type;
    osc.frequency.value = soundDef.freq;
    gain.gain.setValueAtTime(metronomeVolumeRef.current, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + soundDef.decay);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + soundDef.decay + 0.01);
  };

  const stopMetronome = () => {
    if (metronomeIntervalRef.current !== null) {
      clearInterval(metronomeIntervalRef.current);
      metronomeIntervalRef.current = null;
    }
    metronomeActiveRef.current = false;
    setMetronomeActive(false);
  };

  const startMetronome = (bpm: number) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    tick();
    metronomeIntervalRef.current = window.setInterval(tick, (60 / bpm) * 1000);
    metronomeActiveRef.current = true;
    setMetronomeActive(true);
  };

  const toggleMetronome = () => {
    if (metronomeActiveRef.current) {
      stopMetronome();
    } else {
      startMetronome(settings.playScaleBpm);
    }
  };

  const handleSoundChange = (sound: MetronomeSound) => {
    metronomeSoundRef.current = sound;
    setMetronomeSound(sound);
  };

  const handleVolumeChange = (vol: number) => {
    metronomeVolumeRef.current = vol;
    setMetronomeVolume(vol);
  };

  useEffect(() => {
    if (!metronomeActiveRef.current) return;
    if (metronomeIntervalRef.current !== null)
      clearInterval(metronomeIntervalRef.current);
    tick();
    metronomeIntervalRef.current = window.setInterval(
      tick,
      (60 / settings.playScaleBpm) * 1000,
    );
  }, [settings.playScaleBpm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopMetronome(), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (bpmRef.current && !bpmRef.current.contains(e.target as Node)) {
        setBpmOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="play-scale">
      <div className="play-scale__scroll">
        <button
          className="play-scale__btn"
          onClick={() => set({ playScale: !settings.playScale })}
          aria-label={settings.playScale ? "Stop" : "Play scale"}
        >
          {settings.playScale ? <FaStop size={12} /> : <FaPlay size={12} />}
        </button>

        <button
          className={`play-scale__btn ${metronomeActive ? "play-scale__btn--active" : ""}`}
          onClick={toggleMetronome}
          aria-label={metronomeActive ? "Stop metronome" : "Start metronome"}
        >
          <PiMetronomeBold size={15} />
        </button>

        <button
          className={`play-scale__btn ${activeTrack ? "play-scale__btn--active-blue" : ""}`}
          onClick={() => setModalOpen(true)}
          aria-label="Backing track"
        >
          {activeTrack ? <TbMusicPause size={16} /> : <TbMusic size={16} />}
        </button>

        <div className="play-scale__bpm">
          <input
            type="range"
            min={40}
            max={240}
            value={settings.playScaleBpm}
            onChange={(e) => set({ playScaleBpm: Number(e.target.value) })}
            aria-label="BPM"
          />
          <span>{settings.playScaleBpm} BPM</span>
        </div>

        <div className="play-scale__settings-wrapper play-scale__bpm-dropdown" ref={bpmRef}>
          <button
            className="play-scale__bpm-btn"
            onClick={() => setBpmOpen((o) => !o)}
            aria-label="BPM"
          >
            {settings.playScaleBpm} BPM
          </button>

          {bpmOpen && (
            <div className="play-scale__menu play-scale__menu--bpm">
              <span className="play-scale__menu-label">BPM</span>
              <div className="play-scale__menu-volume">
                <input
                  type="range"
                  min={40}
                  max={240}
                  value={settings.playScaleBpm}
                  onChange={(e) => set({ playScaleBpm: Number(e.target.value) })}
                  aria-label="BPM"
                />
                <span>{settings.playScaleBpm}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="play-scale__settings-wrapper" ref={menuRef}>
        <button
          className="play-scale__settings-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Playback settings"
        >
          <IoSettingsOutline size={15} />
        </button>

        {pickerOpen && (
          <InstrumentPicker
            current={selectedInstrument}
            onSelect={(name) => setSelectedInstrument(name)}
            onClose={() => setPickerOpen(false)}
          />
        )}

        {menuOpen && (
          <div className="play-scale__menu">
            <button
              className="play-scale__menu-instrument-row"
              aria-label="Change instrument"
              onClick={() => {
                setMenuOpen(false);
                setPickerOpen(true);
              }}
            >
              <MdMusicNote size={13} />
              <span className="play-scale__menu-instrument-name">
                {INSTRUMENTS.find((i) => i.name === selectedInstrument)?.label ?? selectedInstrument}
              </span>
              <span className="play-scale__menu-instrument-change">Change</span>
            </button>

            <span className="play-scale__menu-label" style={{ marginTop: "8px" }}>
              Direction
            </span>
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

            <span className="play-scale__menu-label" style={{ marginTop: "8px" }}>
              Metronome Sound
            </span>
            <ul>
              {SOUNDS.map(({ label, value }) => (
                <li key={value}>
                  <button
                    className={metronomeSound === value ? "active" : ""}
                    onClick={() => handleSoundChange(value)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <span className="play-scale__menu-label" style={{ marginTop: "8px" }}>
              Metronome Volume
            </span>
            <div className="play-scale__menu-volume">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={metronomeVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
              />
              <span>{Math.round(metronomeVolume * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <BackingTrackModal
          onClose={() => setModalOpen(false)}
          onPlay={(track) => setActiveTrack(track)}
          activeTrackId={activeTrack?.id ?? null}
        />
      )}

      {activeTrack && (
        <FloatingPlayer
          track={activeTrack}
          onClose={() => setActiveTrack(null)}
        />
      )}
    </div>
  );
};

export default PlayScale;
