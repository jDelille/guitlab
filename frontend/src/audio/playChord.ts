import { getInstrument } from "./soundfont";
import type { ChordNote } from "../constants/CagedChords";

// string 0 = low E, string 5 = high e
const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64];

const STRUM_DELAY_MS = 30;

export async function playChord(notes: ChordNote[]) {
  const instrument = await getInstrument();

  const playable = notes
    .filter((n) => !n.isMuted && n.fret !== null)
    .sort((a, b) => a.string - b.string); // low E first

  playable.forEach((note, i) => {
    setTimeout(() => {
      const midi = OPEN_STRING_MIDI[note.string] + (note.fret as number);
      instrument.start({ note: midi, duration: 2 });
    }, i * STRUM_DELAY_MS);
  });
}
