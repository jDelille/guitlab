import { create } from "zustand";
import { Scale } from "tonal";
import GuitarConstants from "../constants/GuitarConstants";
import type { ShapeName } from "../constants/CagedChords";

type Tuning = {
  name: string;
  notes: string[];
};

type GuitarStore = {
  rootNote: string;
  scale: string;
  tuning: string;
  tuningIndex: number;
  sound: string;

  isTriadVisible: boolean;
  isRootNoteVisible: boolean;
  isPowerchordVisible: boolean;

  isFretboardFlipped: boolean;
  isStringsFlipped: boolean;

  position: number;
  numberOfFrets: number;

  activeShape: ShapeName;
  setActiveShape: (shape: ShapeName) => void;

  setRootNote: (note: string) => void;
  setScale: (scale: string) => void;
  setSound: (sound: string) => void;
  setNumberOfFrets: (frets: number) => void;
  setTuning: (tuning: Tuning) => void;

  toggleTriadVisibility: (value: boolean) => void;
  toggleRootNoteVisibility: (value: boolean) => void;
  togglePowerchordVisibility: (value: boolean) => void;

  setFlippedFretboard: (value: boolean) => void;
  setFlippedStrings: (value: boolean) => void;

  setPosition: (position: number) => void;

  areNotesFlat: () => boolean;
  isPositionActive: () => boolean;

  getScaleName: (key: string, currentScale?: string) => string;
};

export const useGuitarStore = create<GuitarStore>((set, get) => ({
  rootNote: "A",
  scale: "major pentatonic",
  tuning: "Standard",
  tuningIndex: 0,
  sound: "acoustic_guitar_nylon",

  isTriadVisible: true,
  isRootNoteVisible: true,
  isPowerchordVisible: false,

  isFretboardFlipped: false,
  isStringsFlipped: false,

  position: 6,
  numberOfFrets: 18,
  activeShape: "C",

  setActiveShape: (shape) => set({ activeShape: shape }),

  setRootNote: (note) => {
    localStorage.setItem("rootNote", note);
    set({ rootNote: note });
  },

  setScale: (scale) => {
    localStorage.setItem("scale", scale);
    set({ scale });
  },

  setSound: (sound) => {
    localStorage.setItem("sound", sound);
    set({ sound });
  },

  setNumberOfFrets: (numberOfFrets) => {
    set({ numberOfFrets });
  },

  setTuning: (tuning) => {
    const tuningIndex = GuitarConstants.tunings.findIndex(
      (t) => t.name === tuning.name,
    );

    localStorage.setItem("tuning", JSON.stringify(tuning));

    set({
      tuning: tuning.name,
      tuningIndex,
    });
  },

  toggleTriadVisibility: (value) => {
    localStorage.setItem("triads", JSON.stringify(value));
    set({ isTriadVisible: value });
  },

  toggleRootNoteVisibility: (value) => {
    localStorage.setItem("storedRootNoteVisibility", JSON.stringify(value));
    set({ isRootNoteVisible: value });
  },

  togglePowerchordVisibility: (value) => {
    localStorage.setItem("powerchord", JSON.stringify(value));
    set({ isPowerchordVisible: value });
  },

  setFlippedFretboard: (value) => {
    set({ isFretboardFlipped: value });
  },

  setFlippedStrings: (value) => {
    set({ isStringsFlipped: value });
  },

  setPosition: (position) => {
    localStorage.setItem("position", position.toString());
    set({ position });
  },

  areNotesFlat: () => {
    const { rootNote, scale } = get();
    const { notes } = Scale.get(`${rootNote} ${scale}`);

    return notes.some((note) => note.includes("b"));
  },

  isPositionActive: () => {
    return get().position !== 6;
  },

  getScaleName: (key, currentScale) => {
    const { scale } = get();

    if (!currentScale) {
      return key
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    const { type } = Scale.get(`${key} ${scale}`);

    return type
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
}));
