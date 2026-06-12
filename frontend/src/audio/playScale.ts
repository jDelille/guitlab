import { getInstrument } from "./soundfont";
import type { PlayNote } from "./utils";

export async function playScale(
  notes: PlayNote[],
  bpm: number,
  direction: string,
  onNote?: (pos: { string: number; fret: number } | null) => void,
  onComplete?: () => void
): Promise<() => void> {
  const instrument = await getInstrument();

  const timers: number[] = [];
  const interval = 60000 / bpm;

  const orderedNotes =
    direction === "desc"
      ? [...notes].reverse()
      : direction === "both"
        ? [...notes, ...[...notes].reverse().slice(1)]
        : notes;

  orderedNotes.forEach((note, i) => {
    const timer = window.setTimeout(() => {
      instrument.play(note.midi);
      onNote?.({ string: note.string, fret: note.fret });
    }, i * interval);
    timers.push(timer);
  });

  const clearTimer = window.setTimeout(() => {
    onNote?.(null);
    onComplete?.();
  }, orderedNotes.length * interval);
  timers.push(clearTimer);

  return () => {
    timers.forEach(clearTimeout);
    onNote?.(null);
  };
}
