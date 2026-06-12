import type { Lick } from "./types";

export const E_SHAPE_LICKS: Lick[] = [
  {
    id: "e-major-blues-approach",
    name: "Major Blues Approach",
    shape: "E",
    scale: "majorScale",
    notes: [
      { string: 2, fret: 8,  degree: "b3", isRoot: false, isMuted: false },
      { string: 2, fret: 9,  degree: 3,    isRoot: false, isMuted: false },
      { string: 1, fret: 8,  degree: 5,    isRoot: false, isMuted: false },
      { string: 1, fret: 10, degree: 6,    isRoot: false, isMuted: false },
      { string: 0, fret: 8,  degree: "R",  isRoot: true,  isMuted: false },
    ],
  },
];
