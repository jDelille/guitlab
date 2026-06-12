import { Soundfont, Reverb } from "smplr";

const audioContext = new AudioContext();
let instrument: ReturnType<typeof Soundfont> | null = null;

export function getAudioContext() {
  return audioContext;
}

export async function getInstrument() {
  if (!instrument) {
    await audioContext.resume();
    instrument = Soundfont(audioContext, {
      instrument: "acoustic_guitar_nylon",
      kit: "FluidR3_GM",
    });
    await instrument.load;
    instrument.output.addEffect("reverb", Reverb(audioContext), 0.00);
  }

  return instrument;
}
