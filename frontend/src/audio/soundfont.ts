let audioContext: AudioContext | null = null;
let instrument: any = null;
let currentInstrumentName = "acoustic_guitar_nylon";

export function getAudioContext(): AudioContext {
  if (!audioContext) audioContext = new AudioContext();
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
    const ctx = getAudioContext();
    await ctx.resume();
    const { Soundfont } = await import("smplr");
    instrument = Soundfont(ctx, {
      instrument: currentInstrumentName,
      kit: "MusyngKite",
    });
    await instrument.load;
  }
  return instrument;
}
