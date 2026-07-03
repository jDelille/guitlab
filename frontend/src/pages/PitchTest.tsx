import { useState, useRef, useCallback, useEffect } from "react";
import "./PitchTest.scss";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function freqToNote(freq: number) {
  if (freq <= 0) return null;
  const midi = 12 * Math.log2(freq / 440) + 69;
  const rounded = Math.round(midi);
  const cents = Math.round((midi - rounded) * 100);
  return {
    note: NOTE_NAMES[((rounded % 12) + 12) % 12],
    octave: Math.floor(rounded / 12) - 1,
    cents,
  };
}

// Autocorrelation pitch detection — guitar range ~40Hz–1300Hz
function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  if (Math.sqrt(rms / buf.length) < 0.02) return -1;

  const n = buf.length;
  const half = Math.floor(n / 2);
  const minPeriod = Math.floor(sampleRate / 1300);
  const maxPeriod = Math.min(Math.floor(sampleRate / 40), half);

  let maxCorr = 0;
  let period = -1;
  for (let lag = minPeriod; lag <= maxPeriod; lag++) {
    let corr = 0;
    for (let i = 0; i < half; i++) corr += buf[i] * buf[i + lag];
    if (corr > maxCorr) { maxCorr = corr; period = lag; }
  }

  return period > 1 ? sampleRate / period : -1;
}

export default function PitchTest() {
  const [listening, setListening] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [result, setResult] = useState<{ note: string; octave: number; cents: number } | null>(null);
  const [freq, setFreq] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const refreshDevices = useCallback(async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    const inputs = all.filter((d) => d.kind === "audioinput");
    setDevices(inputs);
    if (inputs.length && !selectedDevice) setSelectedDevice(inputs[0].deviceId);
  }, [selectedDevice]);

  useEffect(() => {
    refreshDevices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(async () => {
    const constraints: MediaStreamConstraints = {
      audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    streamRef.current = stream;

    // Re-enumerate after permission so labels appear
    await refreshDevices();

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyserRef.current = analyser;

    const buf = new Float32Array(analyser.fftSize);

    const tick = () => {
      analyser.getFloatTimeDomainData(buf);
      const f = autoCorrelate(buf, ctx.sampleRate);
      if (f > 0) {
        setFreq(Math.round(f));
        setResult(freqToNote(f));
      } else {
        setResult(null);
        setFreq(null);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    setListening(true);
  }, [selectedDevice, refreshDevices]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setListening(false);
    setResult(null);
    setFreq(null);
  }, []);

  const centsLabel = result
    ? result.cents > 0
      ? `+${result.cents}¢`
      : result.cents < 0
      ? `${result.cents}¢`
      : "in tune"
    : null;

  return (
    <div className="pitch-test">
      <div className="pitch-test__header">
        <h1 className="pitch-test__title">Pitch Detector</h1>
        <p className="pitch-test__sub">Pick your Focusrite as the input, hit start, play a single note.</p>
      </div>

      <div className="pitch-test__controls">
        <select
          className="pitch-test__select"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          disabled={listening}
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Audio input (${d.deviceId.slice(0, 8)}…)`}
            </option>
          ))}
          {devices.length === 0 && (
            <option value="">No devices found</option>
          )}
        </select>

        <button
          className={`pitch-test__btn${listening ? " pitch-test__btn--stop" : ""}`}
          onClick={listening ? stop : start}
        >
          {listening ? "Stop" : "Start Listening"}
        </button>
      </div>

      <div className="pitch-test__display">
        {result ? (
          <>
            <span className="pitch-test__note">{result.note}</span>
            <span className="pitch-test__octave">{result.octave}</span>
            <span className="pitch-test__freq">{freq} Hz</span>
            <span className={`pitch-test__cents${Math.abs(result.cents) <= 5 ? " pitch-test__cents--intune" : ""}`}>
              {centsLabel}
            </span>
          </>
        ) : (
          <span className="pitch-test__idle">
            {listening ? "Play a note…" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
