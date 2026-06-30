import { useMemo } from "react";
import type { ChordNote } from "../../constants/CagedChords";
import { getShapesForKey, type ShapeName } from "../../constants/CagedChords";
import { getDoubleStopsForKey } from "../../constants/doubleStops";
import { getTriadsForKey, type CagedShape } from "../../constants/triads";
import { buildShapeNoteMap, SHAPE_ORDER } from "./fretboardUtils";

export function useShapeNoteMaps(keyName: string, scale: string, selectedShapes: Set<ShapeName>) {
  const allShapesNoteMap = useMemo(
    () => buildShapeNoteMap(getShapesForKey(keyName), SHAPE_ORDER, scale),
    [keyName, scale],
  );

  const selectedShapesNoteMap = useMemo(
    () => buildShapeNoteMap(
      getShapesForKey(keyName),
      SHAPE_ORDER.filter((s) => selectedShapes.has(s)),
      scale,
    ),
    [keyName, scale, selectedShapes],
  );

  return { allShapesNoteMap, selectedShapesNoteMap };
}

export function useLickNoteMap(lickNotes?: ChordNote[] | null) {
  return useMemo(() => {
    const map = new Map<string, ChordNote>();
    if (!lickNotes) return map;
    lickNotes
      .filter((n) => n.fret !== null)
      .forEach((n) => map.set(`${n.string}-${n.fret}`, n));
    return map;
  }, [lickNotes]);
}

export function useDoubleStops(keyName: string, scale: string, showDoubleStops: boolean) {
  const pairs = useMemo(
    () => (showDoubleStops ? getDoubleStopsForKey(keyName, scale) : []),
    [keyName, scale, showDoubleStops],
  );

  const map = useMemo(() => {
    const m = new Map<string, number>();
    pairs.forEach(({ strings, frets }, idx) => {
      m.set(`${strings[0]}-${frets[0]}`, idx + 1);
      m.set(`${strings[1]}-${frets[1]}`, idx + 1);
    });
    return m;
  }, [pairs]);

  const insideBracketSet = useMemo(() => {
    const set = new Set<string>();
    pairs.forEach(({ strings, frets }) => {
      const minStr = Math.min(strings[0], strings[1]);
      const maxStr = Math.max(strings[0], strings[1]);
      const minFret = Math.min(frets[0], frets[1]);
      const maxFret = Math.max(frets[0], frets[1]);
      for (let s = minStr; s <= maxStr; s++) {
        for (let f = minFret; f <= maxFret; f++) {
          set.add(`${s}-${f}`);
        }
      }
    });
    return set;
  }, [pairs]);

  return { pairs, map, insideBracketSet };
}

export function useTriads(keyName: string, cagedChord: string, showTriads: boolean) {
  const positions = useMemo(
    () => (showTriads ? getTriadsForKey(keyName, cagedChord as CagedShape) : []),
    [keyName, cagedChord, showTriads],
  );

  const map = useMemo(() => {
    const set = new Set<string>();
    positions.forEach(({ strings, frets }) =>
      [0, 1, 2].forEach((i) => set.add(`${strings[i]}-${frets[i]}`)),
    );
    return set;
  }, [positions]);

  return { positions, map };
}
