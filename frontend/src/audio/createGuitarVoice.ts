export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Generates a waveshaper distortion curve, mimicking amp clipping.
 */
export function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const sampleCount = 44100;
  const curve = new Float32Array(sampleCount) as Float32Array<ArrayBuffer>;
  const deg = Math.PI / 180;

  for (let i = 0; i < sampleCount; i++) {
    const x = (i * 2) / sampleCount - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export function createGuitarVoice(ctx: AudioContext, midi: number) {
  const now = ctx.currentTime;
  const frequency = midiToFrequency(midi);

  // Oscillators
  const oscillator = ctx.createOscillator();
  const harmonicOscillator = ctx.createOscillator();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(frequency, now);

  harmonicOscillator.type = "triangle";
  harmonicOscillator.frequency.setValueAtTime(frequency * 2, now);
  harmonicOscillator.detune.value = -8;

  // Effects
  const distortion = ctx.createWaveShaper();
  distortion.curve = makeDistortionCurve(20);
  distortion.oversample = "4x";

  const highPass = ctx.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.setValueAtTime(100, now);

  const cabinetFilter = ctx.createBiquadFilter();
  cabinetFilter.type = "lowpass";
  cabinetFilter.frequency.setValueAtTime(3000, now);

  // Volume
  const gainNode = ctx.createGain();

  gainNode.gain.setValueAtTime(0.001, now);

  gainNode.gain.exponentialRampToValueAtTime(0.25, now + 0.01);

  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2);

  // Wire everything together
  oscillator.connect(distortion);
  harmonicOscillator.connect(distortion);

  distortion.connect(highPass);
  highPass.connect(cabinetFilter);
  cabinetFilter.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Start playback
  oscillator.start(now);
  harmonicOscillator.start(now);

  return {
    oscillator,
    harmonicOscillator,
    gainNode,
  };
}
