import { Soundfont } from "smplr";

const audioContext = new AudioContext();
let instrument: ReturnType<typeof Soundfont> | null = null;
let currentInstrumentName = "acoustic_guitar_nylon";

export function getAudioContext() {
  return audioContext;
}

export function getCurrentInstrumentName() {
  return currentInstrumentName;
}

export function setInstrument(name: string) {
  currentInstrumentName = name;
  instrument = null;
}

export async function getInstrument() {
  if (!instrument) {
    await audioContext.resume();
    instrument = Soundfont(audioContext, {
      instrument: currentInstrumentName,
      kit: "MusyngKite",
    });
    await instrument.load;
  }

  return instrument;
}
