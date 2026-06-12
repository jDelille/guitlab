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

  const interval = 60 / bpm; // seconds

  const orderedNotes =
    direction === "desc"
      ? [...notes].reverse()
      : direction === "both"
        ? [...notes, ...[...notes].reverse().slice(1)]
        : notes;

  const timers: number[] = [];
  const intervalMs = interval * 1000;

  orderedNotes.forEach((note, i) => {
    const timer = window.setTimeout(() => {
      instrument.start({ note: note.midi });
      onNote?.({ string: note.string, fret: note.fret });
    }, i * intervalMs);
    timers.push(timer);
  });

  const clearTimer = window.setTimeout(() => {
    onNote?.(null);
    onComplete?.();
  }, orderedNotes.length * intervalMs);
  timers.push(clearTimer);

  return () => {
    timers.forEach(clearTimeout);
    instrument.stop();
    onNote?.(null);
  };
}
