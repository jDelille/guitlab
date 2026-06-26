import type { Pattern } from "./types";

export const MINOR_145_PATTERN: Pattern = {
  id: "minor-145",
  name: "Minor 1-4-5",
  notes: [
    // I (Am)
    { string: 5, fret: 5, isRoot: false, isMuted: false },
    { string: 5, fret: 8, isRoot: false, isMuted: false },
    { string: 4, fret: 7, isRoot: false, isMuted: false },

    // IV (Dm)
    { string: 4, fret: 5, isRoot: false, isMuted: false },
    { string: 4, fret: 8, isRoot: false, isMuted: false },
    { string: 3, fret: 7, isRoot: false, isMuted: false },

    // V (Em)
    { string: 4, fret: 7, isRoot: false, isMuted: false },
    { string: 3, fret: 6, isRoot: false, isMuted: false },
    { string: 2, fret: 4, isRoot: false, isMuted: false },
    { string: 3, fret: 7, isRoot: false, isMuted: false },
  ],
};
