import { useEffect, useRef } from "react";
import { playScale } from "../audio/playScale";

type Direction = "asc" | "desc" | "both";

export function useScalePlayback(settings: any, midiNotes: number[]) {
  const stopRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (!settings.playScale) return;

    let stop: (() => void) | undefined;

    playScale(
      midiNotes,
      settings.playScaleBpm,
      settings.playScaleDirection,
    ).then((s) => {
      stop = s;
    });

    return () => {
      stop?.();
    };
  }, [
    settings.playScale,
    settings.playScaleBpm,
    settings.playScaleDirection,
    midiNotes,
  ]);
}
