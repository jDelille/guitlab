import { SHAPE_COLORS } from "../components/chords/constants";
import type { CagedKeyData, ShapeName } from "../constants/CagedChords";
import { SHAPE_ROOT_FRETS } from "../constants/shapeRootFrets";
import { CHORD_TEMPLATES, MINOR_CHORD_TEMPLATES } from "../constants/shapes/chordTemplates";
import { buildCagedShape } from "./buildCagedShape";
import getNoteFromDegree from "./getNoteFromDegree";

function normalizeKey(key: string): string {
  return key.replace("♭", "b").replace("♯", "#");
}

export function buildCagedChords(key: string): CagedKeyData {
  const shapes: ShapeName[] = ["C", "A", "G", "E", "D"];
  const normalizedKey = normalizeKey(key);


  return Object.fromEntries(
    shapes.map((shapeName) => {
      const template = CHORD_TEMPLATES[shapeName];
      const targetRoot = SHAPE_ROOT_FRETS[shapeName][normalizedKey];
      const offset = targetRoot - template.baseFret;

      const notes = template.notes.map((n) => ({
        ...n,
        fret: n.fret !== null ? n.fret + offset : null,
        note: getNoteFromDegree(normalizedKey, n.degree),
      }));

      const barre = template.barre
        ? { ...template.barre, fret: template.barre.fret + offset }
        : null;

      const minorTemplate = MINOR_CHORD_TEMPLATES[shapeName];
      const minorNotes = minorTemplate.notes.map((n) => ({
        ...n,
        fret: n.fret !== null ? n.fret + offset : null,
        note: getNoteFromDegree(normalizedKey, n.degree),
      }));

      return [
        shapeName,
        {
          ...template,
          baseFret: template.baseFret + offset,
          barre,
          notes,
          majorChord: notes,
          color: SHAPE_COLORS[shapeName],
          ...buildCagedShape(normalizedKey, shapeName, offset),
          minorChord: minorNotes,
        },
      ];
    })
  ) as unknown as CagedKeyData;
}