import { useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { getAudioContext, setInstrument } from "../../../audio/soundfont";
import "./InstrumentPicker.scss";

export interface InstrumentOption {
  name: string;
  label: string;
  category: string;
}

export const INSTRUMENTS: InstrumentOption[] = [
  { name: "acoustic_guitar_nylon", label: "Nylon Guitar",     category: "Guitar" },
  { name: "acoustic_guitar_steel", label: "Steel Guitar",     category: "Guitar" },
  { name: "electric_guitar_clean", label: "Clean Electric",   category: "Guitar" },
  { name: "electric_guitar_jazz",  label: "Jazz Guitar",      category: "Guitar" },
  { name: "electric_guitar_muted", label: "Muted Electric",   category: "Guitar" },
  { name: "overdriven_guitar",     label: "Overdriven",       category: "Guitar" },
  { name: "distortion_guitar",     label: "Distortion",       category: "Guitar" },
  { name: "guitar_harmonics",      label: "Harmonics",        category: "Guitar" },
  { name: "acoustic_grand_piano",  label: "Grand Piano",      category: "Keys"   },
  { name: "electric_piano_1",      label: "Electric Piano",   category: "Keys"   },
  { name: "vibraphone",            label: "Vibraphone",       category: "Mallets"},
  { name: "acoustic_bass",         label: "Acoustic Bass",    category: "Bass"   },
];

const PREVIEW_NOTES = [52, 56, 59]; // E3, G#3, B3

interface Props {
  current: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}

const InstrumentPicker = ({ current, onSelect, onClose }: Props) => {
  const [previewing, setPreviewing] = useState<string | null>(null);

  const handlePreview = async (name: string) => {
    if (previewing === name) {
      setPreviewing(null);
      return;
    }
    setPreviewing(name);
    const ctx = getAudioContext();
    await ctx.resume();
    const { Soundfont } = await import("smplr");
    const temp = Soundfont(ctx, { instrument: name, kit: "MusyngKite" });
    await temp.load;
    PREVIEW_NOTES.forEach((note, i) => {
      setTimeout(() => temp.start({ note, duration: 1.2 }), i * 300);
    });
    setTimeout(() => setPreviewing(null), PREVIEW_NOTES.length * 300 + 1200);
  };

  const handleSelect = (name: string) => {
    setInstrument(name);
    onSelect(name);
    onClose();
  };

  const categories = [...new Set(INSTRUMENTS.map((i) => i.category))];

  return (
    <div className="instrument-picker-overlay" onClick={onClose}>
      <div className="instrument-picker" onClick={(e) => e.stopPropagation()}>
        <div className="instrument-picker__header">
          <h2>Choose Instrument</h2>
          <button className="instrument-picker__close" onClick={onClose}>✕</button>
        </div>

        {categories.map((cat) => (
          <div key={cat} className="instrument-picker__group">
            <span className="instrument-picker__group-label">{cat}</span>
            <div className="instrument-picker__list">
              {INSTRUMENTS.filter((i) => i.category === cat).map((inst) => (
                <div
                  key={inst.name}
                  className={`instrument-card ${current === inst.name ? "instrument-card--active" : ""}`}
                >
                  <span className="instrument-card__label">{inst.label}</span>
                  <div className="instrument-card__actions">
                    <button
                      className={`instrument-card__preview ${previewing === inst.name ? "instrument-card__preview--playing" : ""}`}
                      onClick={() => handlePreview(inst.name)}
                      title="Sample"
                    >
                      {previewing === inst.name ? <FaStop size={10} /> : <FaPlay size={10} />}
                      {previewing === inst.name ? "Playing…" : "Sample"}
                    </button>
                    <button
                      className={`instrument-card__select ${current === inst.name ? "instrument-card__select--current" : ""}`}
                      onClick={() => handleSelect(inst.name)}
                      disabled={current === inst.name}
                    >
                      {current === inst.name ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstrumentPicker;
