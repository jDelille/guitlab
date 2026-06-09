import type { ShapePatterns } from "../../types/ShapePatters";

export const D_SHAPE_BASE: ShapePatterns = {
  arpeggio: [
    { string: 5, fret: 12, degree: 3, isRoot: false, isMuted: false },
    { string: 4, fret: 10, degree: 5, isRoot: false, isMuted: false },
    { string: 3, fret: 10, degree: "R", isRoot: true, isMuted: false },
    { string: 2, fret: 9, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 12, degree: 5, isRoot: false, isMuted: false },
    { string: 1, fret: 13, degree: "R", isRoot: false, isMuted: false },
    { string: 0, fret: 12, degree: 3, isRoot: true, isMuted: false },
  ],

  majorPentatonic: [
    { string: 5, fret: 12, degree: 3, isRoot: true, isMuted: false },
    { string: 4, fret: 10, degree: 5, isRoot: false, isMuted: false },
    { string: 4, fret: 12, degree: 6, isRoot: false, isMuted: false },
    { string: 3, fret: 10, degree: "R", isRoot: true, isMuted: false },
    { string: 3, fret: 12, degree: 2, isRoot: false, isMuted: false },
    { string: 2, fret: 9, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 12, degree: 5, isRoot: false, isMuted: false },
    { string: 1, fret: 10, degree: 6, isRoot: false, isMuted: false },
    { string: 1, fret: 13, degree: "R", isRoot: true, isMuted: false },
    { string: 0, fret: 10, degree: 2, isRoot: false, isMuted: false },
    { string: 0, fret: 12, degree: 3, isRoot: false, isMuted: false },
  ],

  majorScale: [
    { string: 5, fret: 12, degree: 3, isRoot: false, isMuted: false },
    { string: 5, fret: 13, degree: 4, isRoot: false, isMuted: false },

    { string: 4, fret: 10, degree: 5, isRoot: false, isMuted: false },
    { string: 4, fret: 12, degree: 6, isRoot: false, isMuted: false },

    { string: 3, fret: 9, degree: 7, isRoot: false, isMuted: false },
    { string: 3, fret: 10, degree: "R", isRoot: true, isMuted: false },
    { string: 3, fret: 12, degree: 2, isRoot: false, isMuted: false },

    { string: 2, fret: 9, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 10, degree: 4, isRoot: false, isMuted: false },
    { string: 2, fret: 12, degree: 5, isRoot: false, isMuted: false },

    { string: 1, fret: 10, degree: 6, isRoot: false, isMuted: false },
    { string: 1, fret: 12, degree: 7, isRoot: false, isMuted: false },
    { string: 1, fret: 13, degree: "R", isRoot: true, isMuted: false },

    { string: 0, fret: 10, degree: 2, isRoot: false, isMuted: false },
    { string: 0, fret: 12, degree: 3, isRoot: false, isMuted: false },
    { string: 0, fret: 13, degree: 4, isRoot: false, isMuted: false },
  ],

  minorChord: [
    { string: 5, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 4, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: "R", isRoot: true, isMuted: false },
    { string: 2, fret: 1, degree: "b3", isRoot: false, isMuted: false },
    { string: 1, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 0, fret: 0, degree: "R", isRoot: true, isMuted: false },
  ],

  minorArpeggio: [
    { string: 5, fret: -3, degree: 5, isRoot: false, isMuted: false },
    { string: 5, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 4, fret: -1, degree: "b3", isRoot: false, isMuted: false },
    { string: 4, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: "R", isRoot: true, isMuted: false },
    { string: 2, fret: 1, degree: "b3", isRoot: false, isMuted: false },
    { string: 1, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 0, fret: -1, degree: 5, isRoot: false, isMuted: false },
  ],

  minorPentatonic: [
    { string: 5, fret: -3, degree: 5, isRoot: false, isMuted: false },
    { string: 5, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 4, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 4, fret: 2, degree: 4, isRoot: false, isMuted: false },
    { string: 3, fret: -1, degree: 4, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 2, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 2, fret: 2, degree: "R", isRoot: true, isMuted: false },
    { string: 1, fret: -1, degree: "b3", isRoot: false, isMuted: false },
    { string: 1, fret: 2, degree: 4, isRoot: false, isMuted: false },
    { string: 0, fret: -1, degree: 5, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: "b7", isRoot: false, isMuted: false },
  ],

  minorScale: [
    { string: 5, fret: -3, degree: 5, isRoot: false, isMuted: false },
    { string: 5, fret: 0, degree: "R", isRoot: true, isMuted: false },

    { string: 4, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 4, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 4, fret: 2, degree: 2, isRoot: false, isMuted: false },

    { string: 3, fret: -1, degree: "b3", isRoot: false, isMuted: false },
    { string: 3, fret: 0, degree: 4, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: 5, isRoot: false, isMuted: false },

    { string: 2, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 2, fret: 2, degree: "R", isRoot: true, isMuted: false },

    { string: 1, fret: -1, degree: 2, isRoot: false, isMuted: false },
    { string: 1, fret: 0, degree: "b3", isRoot: false, isMuted: false },
    { string: 1, fret: 2, degree: 4, isRoot: false, isMuted: false },

    { string: 0, fret: -1, degree: 5, isRoot: false, isMuted: false },
    { string: 0, fret: 2, degree: "b7", isRoot: false, isMuted: false },
  ],

  dom7Chord: [
    { string: 5, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 4, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: "b7", isRoot: false, isMuted: false },
    { string: 2, fret: 1, degree: 3, isRoot: false, isMuted: false },
    { string: 1, fret: null, degree: null, isRoot: false, isMuted: true },
    { string: 0, fret: null, degree: null, isRoot: false, isMuted: true },
  ],

  dom7Arpeggio: [
    { string: 5, fret: -3, degree: 5, isRoot: false, isMuted: false },
    { string: 5, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 4, fret: -1, degree: 3, isRoot: false, isMuted: false },
    { string: 4, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 3, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: "R", isRoot: true, isMuted: false },
    { string: 2, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 1, fret: 2, degree: 5, isRoot: false, isMuted: false },
    { string: 0, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 0, fret: 2, degree: "R", isRoot: true, isMuted: false },
  ],

  dom7Scale: [
    { string: 5, fret: -3, degree: 5, isRoot: false, isMuted: false },
    { string: 5, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 5, fret: 2, degree: 2, isRoot: false, isMuted: false },

    { string: 4, fret: -1, degree: 3, isRoot: false, isMuted: false },
    { string: 4, fret: 0, degree: 4, isRoot: false, isMuted: false },
    { string: 4, fret: 2, degree: 5, isRoot: false, isMuted: false },

    { string: 3, fret: -2, degree: 6, isRoot: false, isMuted: false },
    { string: 3, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: "R", isRoot: true, isMuted: false },

    { string: 2, fret: -1, degree: 2, isRoot: false, isMuted: false },
    { string: 2, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 3, degree: 4, isRoot: false, isMuted: false },

    { string: 1, fret: -1, degree: 5, isRoot: false, isMuted: false },
    { string: 1, fret: 2, degree: 6, isRoot: false, isMuted: false },

    { string: 0, fret: -1, degree: "b7", isRoot: false, isMuted: false },
    { string: 0, fret: 0, degree: "R", isRoot: true, isMuted: false },
    { string: 0, fret: 2, degree: 2, isRoot: false, isMuted: false },
  ],
};
