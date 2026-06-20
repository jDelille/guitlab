import { getInstrument } from "./soundfont";
import type { PlayNote } from "./utils";
import type { DoubleStopPair } from "../constants/doubleStops";
import type { Triad } from "../constants/triads";

const MIDI_TUNING = [64, 59, 55, 50, 45, 40];

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

export async function playDoubleStops(
  pairs: DoubleStopPair[],
  bpm: number,
  onStep?: (positions: { string: number; fret: number }[] | null) => void,
  onComplete?: () => void
): Promise<() => void> {
  const instrument = await getInstrument();
  const intervalMs = (60 / bpm) * 1000;
  const timers: number[] = [];

  pairs.forEach((pair, i) => {
    const timer = window.setTimeout(() => {
      pair.strings.forEach((s, idx) => {
        instrument.start({ note: MIDI_TUNING[s] + pair.frets[idx] });
      });
      onStep?.(pair.strings.map((s, idx) => ({ string: s, fret: pair.frets[idx] })));
    }, i * intervalMs);
    timers.push(timer);
  });

  const clearTimer = window.setTimeout(() => {
    onStep?.(null);
    onComplete?.();
  }, pairs.length * intervalMs);
  timers.push(clearTimer);

  return () => {
    timers.forEach(clearTimeout);
    instrument.stop();
    onStep?.(null);
  };
}

export async function playTriads(
  triads: Triad[],
  bpm: number,
  onStep?: (positions: { string: number; fret: number }[] | null) => void,
  onComplete?: () => void
): Promise<() => void> {
  const instrument = await getInstrument();
  const intervalMs = (60 / bpm) * 1000;
  const timers: number[] = [];

  triads.forEach((triad, i) => {
    const timer = window.setTimeout(() => {
      triad.strings.forEach((s, idx) => {
        instrument.start({ note: MIDI_TUNING[s] + triad.frets[idx] });
      });
      onStep?.(triad.strings.map((s, idx) => ({ string: s, fret: triad.frets[idx] })));
    }, i * intervalMs);
    timers.push(timer);
  });

  const clearTimer = window.setTimeout(() => {
    onStep?.(null);
    onComplete?.();
  }, triads.length * intervalMs);
  timers.push(clearTimer);

  return () => {
    timers.forEach(clearTimeout);
    instrument.stop();
    onStep?.(null);
  };
}
