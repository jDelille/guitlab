import { useRef, useState, useEffect } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbMusic, TbMusicPause } from "react-icons/tb";
import { GiMetronome } from "react-icons/gi";
import { MdMusicNote } from "react-icons/md";
import InstrumentPicker, { INSTRUMENTS } from "./InstrumentPicker";
import { getCurrentInstrumentName } from "../../../audio/soundfont";
import "./PlayScale.scss";
import { useSettings } from "../../../context/SettingsContext";
import { usePlayback, type BackingChord } from "../../../context/PlaybackContext";

const KEY_MIDI: Record<string, number> = {
  C: 48,
  "C#": 49,
  Db: 49,
  D: 50,
  "D#": 51,
  Eb: 51,
  E: 52,
  F: 53,
  "F#": 54,
  Gb: 54,
  G: 55,
  "G#": 56,
  Ab: 56,
  A: 57,
  "A#": 58,
  Bb: 58,
  B: 59,
};

const BEATS_PER_CHORD = 4;

interface BackingProgression { id: string; label: string; chords: BackingChord[] }

const PROGRESSION_SECTIONS: { label: string; progressions: BackingProgression[] }[] = [
  {
    label: "Major",
    progressions: [
      { id: "I-IV-V-I",   label: "I — IV — V — I",    chords: [{offset:0,quality:"major"},{offset:5,quality:"major"},{offset:7,quality:"major"},{offset:0,quality:"major"}] },
      { id: "I-V-vi-IV",  label: "I — V — vi — IV",   chords: [{offset:0,quality:"major"},{offset:7,quality:"major"},{offset:9,quality:"minor"},{offset:5,quality:"major"}] },
    ],
  },
  {
    label: "Minor",
    progressions: [
      { id: "i-iv-V-i",   label: "i — iv — V — i",       chords: [{offset:0,quality:"minor"},{offset:5,quality:"minor"},{offset:7,quality:"major"},{offset:0,quality:"minor"}] },
      { id: "i-VII-VI",   label: "i — ♭VII — ♭VI — ♭VII", chords: [{offset:0,quality:"minor"},{offset:10,quality:"major"},{offset:8,quality:"major"},{offset:10,quality:"major"}] },
    ],
  },
];

const ALL_PROGRESSIONS = PROGRESSION_SECTIONS.flatMap((s) => s.progressions);

function playChordStab(rootMidi: number, ctx: AudioContext, volume: number, quality: "major" | "minor") {
  const intervals = quality === "major" ? [0, 4, 7] : [0, 3, 7];
  intervals.forEach((interval) => {
    const freq = 440 * Math.pow(2, (rootMidi + interval - 69) / 12);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.8);
  });
}

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
  const [backingMenuOpen, setBackingMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(
    getCurrentInstrumentName,
  );
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [metronomeVolume, setMetronomeVolume] = useState(0.3);
  const [metronomeSound, setMetronomeSound] = useState<MetronomeSound>("click");
  const [backingTrackActive, setBackingTrackActive] = useState(false);
  const [backingVolume, setBackingVolume] = useState(0.18);
  const [backingProgressionId, setBackingProgressionId] = useState("I-IV-V-I");

  const { settings, setSettings } = useSettings();
  const { setCurrentBackingChord } = usePlayback();

  const menuRef = useRef<HTMLDivElement>(null);
  const bpmRef = useRef<HTMLDivElement>(null);
  const backingMenuRef = useRef<HTMLDivElement>(null);
  const backingVolumeRef = useRef(0.18);
  const progressionRef = useRef(ALL_PROGRESSIONS[0]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<number | null>(null);
  const metronomeActiveRef = useRef(false);
  const metronomeSoundRef = useRef<MetronomeSound>("click");
  const metronomeVolumeRef = useRef(0.3);
  const backingTrackIntervalRef = useRef<number | null>(null);
  const backingTrackActiveRef = useRef(false);
  const chordIndexRef = useRef(0);

  const set = (patch: Partial<PlayScaleSettings>) =>
    setSettings((s: any) => ({ ...s, ...patch }));

  const tick = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const soundDef =
      SOUNDS.find((s) => s.value === metronomeSoundRef.current) ?? SOUNDS[0];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = soundDef.type;
    osc.frequency.value = soundDef.freq;
    gain.gain.setValueAtTime(metronomeVolumeRef.current, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + soundDef.decay,
    );
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

  const stopBackingTrack = () => {
    if (backingTrackIntervalRef.current !== null) {
      clearInterval(backingTrackIntervalRef.current);
      backingTrackIntervalRef.current = null;
    }
    backingTrackActiveRef.current = false;
    setBackingTrackActive(false);
    setCurrentBackingChord(null);
  };

  const handleBackingVolumeChange = (vol: number) => {
    backingVolumeRef.current = vol;
    setBackingVolume(vol);
  };

  const startBackingTrack = (bpm: number, key: string) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    chordIndexRef.current = 0;
    const progression = progressionRef.current;
    const intervalMs = (60 / bpm) * 1000 * BEATS_PER_CHORD;
    const fireChord = () => {
      const chord = progression.chords[chordIndexRef.current % progression.chords.length];
      playChordStab((KEY_MIDI[key] ?? 48) + chord.offset, audioCtxRef.current!, backingVolumeRef.current, chord.quality);
      setCurrentBackingChord(chord);
      chordIndexRef.current++;
    };
    fireChord();
    backingTrackIntervalRef.current = window.setInterval(fireChord, intervalMs);
    backingTrackActiveRef.current = true;
    setBackingTrackActive(true);
  };

  const toggleBackingTrack = () => {
    if (backingTrackActiveRef.current) {
      stopBackingTrack();
    } else {
      startBackingTrack(settings.playScaleBpm, settings.key);
    }
  };

  const startMetronome = (bpm: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
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

  // Restart at new BPM when slider changes while active
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
    if (!backingTrackActiveRef.current) return;
    stopBackingTrack();
    startBackingTrack(settings.playScaleBpm, settings.key);
  }, [settings.playScaleBpm, settings.key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopBackingTrack(), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (bpmRef.current && !bpmRef.current.contains(e.target as Node)) {
        setBpmOpen(false);
      }
      if (backingMenuRef.current && !backingMenuRef.current.contains(e.target as Node)) {
        setBackingMenuOpen(false);
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
        aria-label={settings.playScale ? "Stop" : "Play scale"}
      >
        {settings.playScale ? <FaStop size={12} /> : <FaPlay size={12} />}
      </button>

      <button
        className={`play-scale__btn ${metronomeActive ? "play-scale__btn--active" : ""}`}
        onClick={toggleMetronome}
        aria-label={metronomeActive ? "Stop metronome" : "Start metronome"}
      >
        <GiMetronome size={15} />
      </button>

      <div className="play-scale__settings-wrapper" ref={backingMenuRef}>
        <button
          className={`play-scale__btn ${backingTrackActive ? "play-scale__btn--active-blue" : ""}`}
          onClick={() => setBackingMenuOpen((o) => !o)}
          aria-label="Backing track"
        >
          {backingTrackActive ? <TbMusicPause size={16} /> : <TbMusic size={16} />}
        </button>

        {backingMenuOpen && (
          <div className="play-scale__menu">
            <button
              className="play-scale__menu-instrument-row"
              onClick={toggleBackingTrack}
            >
              {backingTrackActive ? <TbMusicPause size={13} /> : <TbMusic size={13} />}
              <span className="play-scale__menu-instrument-name">
                {backingTrackActive ? "Stop" : "Start"}
              </span>
              <span className="play-scale__menu-instrument-change">
                {backingTrackActive ? "On" : "Off"}
              </span>
            </button>

            {PROGRESSION_SECTIONS.map(({ label, progressions }) => (
              <div key={label}>
                <span className="play-scale__menu-label" style={{ marginTop: "8px" }}>
                  {label}
                </span>
                <ul>
                  {progressions.map(({ id, label: pLabel }) => (
                    <li key={id}>
                      <button
                        className={backingProgressionId === id ? "active" : ""}
                        onClick={() => {
                          const prog = ALL_PROGRESSIONS.find((p) => p.id === id) ?? ALL_PROGRESSIONS[0];
                          progressionRef.current = prog;
                          setBackingProgressionId(id);
                          if (backingTrackActive) {
                            stopBackingTrack();
                            setTimeout(() => startBackingTrack(settings.playScaleBpm, settings.key), 0);
                          }
                        }}
                      >
                        {pLabel}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <span className="play-scale__menu-label" style={{ marginTop: "8px" }}>
              Volume
            </span>
            <div className="play-scale__menu-volume">
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={backingVolume}
                onChange={(e) => handleBackingVolumeChange(Number(e.target.value))}
              />
              <span>{Math.round((backingVolume / 0.5) * 100)}%</span>
            </div>
          </div>
        )}
      </div>

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
                {INSTRUMENTS.find((i) => i.name === selectedInstrument)
                  ?.label ?? selectedInstrument}
              </span>
              <span className="play-scale__menu-instrument-change">Change</span>
            </button>

            <span
              className="play-scale__menu-label"
              style={{ marginTop: "8px" }}
            >
              Direction
            </span>
            <ul>
              {DIRECTIONS.map(({ label, value }) => (
                <li key={value}>
                  <button
                    className={
                      settings.playScaleDirection === value ? "active" : ""
                    }
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

            <span
              className="play-scale__menu-label"
              style={{ marginTop: "8px" }}
            >
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

            <span
              className="play-scale__menu-label"
              style={{ marginTop: "8px" }}
            >
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
    </div>
  );
};

export default PlayScale;
