import Soundfont from "soundfont-player";

let instrument: any;
const audioContext = new AudioContext();

export async function getInstrument() {
  if (!instrument) {
    await audioContext.resume();

    instrument = await Soundfont.instrument(
      audioContext,
      "acoustic_guitar_nylon",
      { dry: 1, wet: 0 }
    );
  }

  return instrument;
}