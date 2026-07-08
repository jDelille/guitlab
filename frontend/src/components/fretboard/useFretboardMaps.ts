import { useMemo } from "react";
import type { ChordNote } from "../../constants/CagedChords";
import { getShapesForKey, withAlpha, type ShapeName } from "../../constants/CagedChords";
import { getDoubleStopsForKey } from "../../constants/doubleStops";
import { getTriadsForKey } from "../../constants/triads";
import { buildShapeNoteMap, SHAPE_ORDER } from "./fretboardUtils";
import { SHAPE_COLORS } from "../chords/constants";

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

export interface TriadMapEntry {
  colors: string[];
  dimColors: string[];
}

export function useTriads(
  keyName: string,
  selectedShapes: Set<ShapeName>,
  showTriads: boolean,
) {
  const positions = useMemo(() => {
    if (!showTriads) {
      return [];
    }
    return getTriadsForKey(keyName).filter((triad) => {
      return selectedShapes.has(triad.shape);
    });
  }, [keyName, selectedShapes, showTriads]);

  const map = useMemo(() => {
    const grouped = new Map<string, ShapeName[]>();
    positions.forEach((triad) => {
      [0, 1, 2].forEach((i) => {
        const noteKey = `${triad.strings[i]}-${triad.frets[i]}`;
        const shapes = grouped.get(noteKey) ?? [];
        shapes.push(triad.shape);
        grouped.set(noteKey, shapes);
      });
    });

    const result = new Map<string, TriadMapEntry>();
    grouped.forEach((shapes, noteKey) => {
      const orderedShapes = SHAPE_ORDER.filter((s) => {
        return shapes.includes(s);
      });
      result.set(noteKey, {
        colors: orderedShapes.map((s) => {
          return SHAPE_COLORS[s];
        }),
        dimColors: orderedShapes.map((s) => {
          return withAlpha(SHAPE_COLORS[s], 0.55);
        }),
      });
    });
    return result;
  }, [positions]);

  return { positions, map };
}
