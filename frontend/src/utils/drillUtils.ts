import { getShapesForKey, type ShapeName } from "../constants/CagedChords";
import type { Scales } from "../types/Scales";

export const DRILL_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
export const DRILL_SHAPES: ShapeName[] = ["C", "A", "G", "E", "D"];

export const SCALE_LABELS: Record<string, string> = {
  majorChord:      "Major Chord",
  majorPentatonic: "Major Pentatonic",
  majorScale:      "Major Scale",
  arpeggio:        "Major Arpeggio",
  minorChord:      "Minor Chord",
  minorPentatonic: "Minor Pentatonic",
  minorScale:      "Minor Scale",
  minorArpeggio:   "Minor Arpeggio",
  dom7Chord:       "Dom7 Chord",
};

export type FeedbackState = "correct" | "wrong" | "missed";

export interface ComboProgress {
  key: string;
  shape: string;
  scale: string;
  bestScore: number | null;
}

export interface DrillConfig {
  label: string;
  scaleKey: Scales;
  prompt: (key: string, shape: string) => string;
}

export const DRILL_CONFIG: Record<string, DrillConfig> = {
  "major-caged-chords": {
    label: "Major CAGED Chords",
    scaleKey: "majorChord",
    prompt: (key, shape) => `Map the major ${shape}-shape chord in the key of ${key}`,
  },
  "minor-caged-chords": {
    label: "Minor CAGED Chords",
    scaleKey: "minorChord",
    prompt: (key, shape) => `Map the minor ${shape}-shape chord in the key of ${key}`,
  },
  "dom7-caged-chords": {
    label: "Dom7 CAGED Chords",
    scaleKey: "dom7Chord",
    prompt: (key, shape) => `Map the Dom7 ${shape}-shape chord in the key of ${key}`,
  },
  "major-scale": {
    label: "Major Scale",
    scaleKey: "majorScale",
    prompt: (key, shape) => `Map the major scale in the key of ${key} using the ${shape} shape`,
  },
  "major-pentatonic": {
    label: "Major Pentatonic",
    scaleKey: "majorPentatonic",
    prompt: (key, shape) => `Map the major pentatonic in the key of ${key} using the ${shape} shape`,
  },
  "major-arpeggio": {
    label: "Major Arpeggio",
    scaleKey: "arpeggio",
    prompt: (key, shape) => `Map the major arpeggio in the key of ${key} using the ${shape} shape`,
  },
  "minor-scale": {
    label: "Minor Scale",
    scaleKey: "minorScale",
    prompt: (key, shape) => `Map the minor scale in the key of ${key} using the ${shape} shape`,
  },
  "minor-pentatonic": {
    label: "Minor Pentatonic",
    scaleKey: "minorPentatonic",
    prompt: (key, shape) => `Map the minor pentatonic in the key of ${key} using the ${shape} shape`,
  },
  "minor-arpeggio": {
    label: "Minor Arpeggio",
    scaleKey: "minorArpeggio",
    prompt: (key, shape) => `Map the minor arpeggio in the key of ${key} using the ${shape} shape`,
  },
};

export function getKeyProgress(progress: ComboProgress[], shapes: ShapeName[], scale: string): Record<string, string> {
  return Object.fromEntries(
    DRILL_KEYS.map((key) => {
      const solved = shapes.filter((s) => progress.find((p) => p.key === key && p.shape === s && p.scale === scale && p.bestScore === 100)).length;
      return [key, `${solved}/${shapes.length}`];
    })
  );
}

export function getShapeProgress(progress: ComboProgress[], keys: string[], scale: string): Record<string, string> {
  return Object.fromEntries(
    DRILL_SHAPES.map((shape) => {
      const solved = keys.filter((k) => progress.find((p) => p.key === k && p.shape === shape && p.scale === scale && p.bestScore === 100)).length;
      return [shape, `${solved}/${keys.length}`];
    })
  );
}

export function getPrefilledNotes(correct: Set<string>, difficulty: string): Set<string> {
  const all = [...correct].sort((a, b) => {
    const [strA] = a.split("-").map(Number);
    const [strB] = b.split("-").map(Number);
    return strB - strA; // string 5 (low E) first, string 0 (high e) last
  });
  if (difficulty === "Novice") return new Set(all.slice(0, Math.floor(all.length / 2)));
  if (difficulty === "Intermediate") return new Set(all.slice(0, 2));
  return new Set();
}

export function getNextCombo(
  progress: ComboProgress[],
  scales: Scales[] = ["majorPentatonic", "majorScale", "arpeggio"],
): { key: string; shape: ShapeName; scale: Scales } {
  for (let ki = 0; ki < DRILL_KEYS.length; ki++) {
    const key = DRILL_KEYS[ki];
    const unlockedShapes =
      ki === 0
        ? DRILL_SHAPES.length
        : DRILL_SHAPES.filter((s) =>
            scales.every((sc) =>
              progress.some(
                (p) => p.key === DRILL_KEYS[ki - 1] && p.shape === s && p.scale === sc && p.bestScore === 100,
              ),
            ),
          ).length >= 3
          ? DRILL_SHAPES.length
          : 0;
    if (unlockedShapes === 0) break;

    for (const shape of DRILL_SHAPES) {
      for (const scale of scales) {
        const done = progress.some((p) => p.key === key && p.shape === shape && p.scale === scale && p.bestScore === 100);
        if (!done) return { key, shape, scale };
      }
    }
  }

  return { key: DRILL_KEYS[0], shape: DRILL_SHAPES[0], scale: scales[0] };
}

export function getScaleProgress(progress: ComboProgress[], scales: string[]): Record<string, string> {
  const total = DRILL_KEYS.length * DRILL_SHAPES.length;
  return Object.fromEntries(
    scales.map((scale) => {
      const solved = progress.filter((p) => p.scale === scale && p.bestScore === 100).length;
      return [scale, `${solved}/${total}`];
    })
  );
}

export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildCorrectSet(key: string, shape: ShapeName, scale: Scales): Set<string> {
  const notes = getShapesForKey(key)[shape][scale].filter(
    (n) => !n.isOctaveExtension && n.fret !== null,
  );
  return new Set(notes.map((n) => `${5 - n.string}-${n.fret}`));
}

export function scoreAnswer(selected: Set<string>, correct: Set<string>) {
  const feedback = new Map<string, FeedbackState>();
  selected.forEach((k) => feedback.set(k, correct.has(k) ? "correct" : "wrong"));
  correct.forEach((k) => { if (!selected.has(k)) feedback.set(k, "missed"); });
  const correctCount = [...selected].filter((k) => correct.has(k)).length;
  const points = Math.round((correctCount / correct.size) * 100);
  return { feedback, points };
}
