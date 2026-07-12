import type { Lick } from "./types";

export const E_SHAPE_LICKS: Lick[] = [
  {
    id: "e-major-blues-approach",
    name: "Major Blues Approach",
    shape: "E",
    scale: "majorScale",
    notes: [
      { string: 2, fret: 10, degree: 3, isRoot: false, isMuted: false },
      { string: 1, fret: 11, degree: 5, isRoot: false, isMuted: false },

      { string: 2, fret: 10, degree: 3, isRoot: false, isMuted: false },
      { string: 2, fret: 10, degree: 3, isRoot: false, isMuted: false },
      { string: 2, fret: 8, degree: 3, isRoot: false, isMuted: false },
      { string: 2, fret: 10, degree: 3, isRoot: false, isMuted: false },
      { string: 3, fret: 10, degree: 3, isRoot: false, isMuted: false },

      { string: 3, fret: 8, degree: 3, isRoot: false, isMuted: false },
      { string: 4, fret: 10, degree: 3, isRoot: false, isMuted: false },
      { string: 4, fret: 9, degree: 3, isRoot: false, isMuted: false },
      { string: 4, fret: 8, degree: 3, isRoot: false, isMuted: false },

      { string: 5, fret: 11, degree: 3, isRoot: false, isMuted: false },
      { string: 4, fret: 8, degree: 3, isRoot: false, isMuted: false },
      { string: 4, fret: 9, degree: 3, isRoot: false, isMuted: false },
      { string: 4, fret: 10, degree: 3, isRoot: false, isMuted: false },
      { string: 5, fret: 8, degree: 3, isRoot: false, isMuted: false },
    ],
    
    techniques: {
      0: {
        technique: "bend",
        bend: {
          amount: 2,
          duration: 800,
        },
      },
      2: {
        technique: "bend",
        bend: {
          amount: 2,
          duration: 400,
        },
      },
    },
  },
];
