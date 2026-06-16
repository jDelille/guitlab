import { getShapesForKey, type ShapeName } from "../constants/CagedChords";
import type { Scales } from "../types/Scales";

export const DRILL_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
export const DRILL_SHAPES: ShapeName[] = ["C", "A", "G", "E", "D"];
export const SCALE_LABELS: Record<string, string> = {
  majorPentatonic: "Major Pentatonic",
  majorScale: "Major Scale",
};

export type FeedbackState = "correct" | "wrong" | "missed";

export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildCorrectSet(key: string, shape: ShapeName, scale: Scales): Set<string> {
  const notes = getShapesForKey(key)[shape][scale].filter((n) => !n.isOctaveExtension);
  return new Set(notes.map((n) => `${n.string}-${n.fret}`));
}

export function scoreAnswer(selected: Set<string>, correct: Set<string>) {
  const feedback = new Map<string, FeedbackState>();
  selected.forEach((k) => feedback.set(k, correct.has(k) ? "correct" : "wrong"));
  correct.forEach((k) => { if (!selected.has(k)) feedback.set(k, "missed"); });
  const correctCount = [...selected].filter((k) => correct.has(k)).length;
  const points = Math.round((correctCount / correct.size) * 100);
  return { feedback, points };
}
