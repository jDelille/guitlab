import type { ShapePatterns } from "../../types/ShapePatters";

export const C_SHAPE_BASE: ShapePatterns = {
  arpeggio: [
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },
    { string: 3, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 0, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: 5, isRoot: false, isMuted: false },
  ],

  majorPentatonic: [
    { string: 5, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },
    { string: 4, fret: 0, degree: 6, isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },
    { string: 3, fret: 0, degree: 2, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 2, fret: 2, degree: 6, isRoot: false, isMuted: false },
    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 1, fret: 3, degree: 2, isRoot: false, isMuted: false },

    { string: 0, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: 5, isRoot: false, isMuted: false },
  ],

  majorScale: [
    { string: 5, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 5, fret: 1, degree: 4, isRoot: false, isMuted: false },
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },

    { string: 4, fret: 0, degree: 6, isRoot: false, isMuted: false },
    { string: 4, fret: 2, degree: 7, isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },

    { string: 3, fret: 0, degree: 2, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 3, fret: 3, degree: 4, isRoot: false, isMuted: false },

    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 2, fret: 2, degree: 6, isRoot: false, isMuted: false },

    { string: 1, fret: 0, degree: 7, isRoot: false, isMuted: false },
    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 1, fret: 3, degree: 2, isRoot: false, isMuted: false },

    { string: 0, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 0, fret: 1, degree: 4, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: 5, isRoot: false, isMuted: false },
  ],

  minorChord: [
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },
    { string: 3, fret: 1, degree: "b3", isRoot: false, isMuted: false },
    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 0, fret: 0, degree: 5, isRoot: false, isMuted: false },
  ],

  minorArpeggio: [
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },
    { string: 3, fret: 1, degree: "b3", isRoot: false, isMuted: false },
    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 0, fret: 3, degree: "b3", isRoot: false, isMuted: false },
    { string: 0, fret: -1, degree: 5, isRoot: false, isMuted: false },
  ],

  minorPentatonic: [
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },

    { string: 4, fret: 1, degree: "b7", isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },

    { string: 3, fret: 1, degree: "b3", isRoot: false, isMuted: false },
    { string: 3, fret: 3, degree: 4, isRoot: false, isMuted: false },

    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 2, fret: 3, degree: "b7", isRoot: false, isMuted: false },

    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 1, fret: 4, degree: "b3", isRoot: false, isMuted: false },

    { string: 0, fret: 1, degree: 4, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: 5, isRoot: false, isMuted: false },
  ],

  minorScale: [
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },

    { string: 4, fret: 1, degree: "b7", isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },

    { string: 3, fret: 0, degree: 2, isRoot: false, isMuted: false },
    { string: 3, fret: 1, degree: "b3", isRoot: false, isMuted: false },
    { string: 3, fret: 3, degree: 4, isRoot: false, isMuted: false },

    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 2, fret: 3, degree: "b7", isRoot: false, isMuted: false },

    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 1, fret: 3, degree: 2, isRoot: false, isMuted: false },
    { string: 1, fret: 4, degree: "b3", isRoot: false, isMuted: false },

    { string: 0, fret: 1, degree: 4, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: 5, isRoot: false, isMuted: false },
  ],

  dom7Chord: [
    { string: 5, fret: null, degree: null, isRoot: false, isMuted: true },

    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },
    { string: 3, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 3, degree: "b7", isRoot: false, isMuted: false },
    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 0, fret: 0, degree: 3, isRoot: false, isMuted: false },
  ],

  dom7Arpeggio: [
    { string: 5, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },

    { string: 4, fret: 1, degree: "b7", isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },

    { string: 3, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 2, fret: 3, degree: "b7", isRoot: false, isMuted: false },

    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 0, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: 5, isRoot: false, isMuted: false },
  ],

  dom7Scale: [
    { string: 5, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 5, fret: 1, degree: 4, isRoot: false, isMuted: false },
    { string: 5, fret: 3, degree: 5, isRoot: false, isMuted: false },

    { string: 4, fret: 0, degree: 6, isRoot: false, isMuted: false },
    { string: 4, fret: 1, degree: "b7", isRoot: false, isMuted: false },
    { string: 4, fret: 3, degree: "R", isRoot: true, isMuted: false },

    { string: 3, fret: 0, degree: 2, isRoot: false, isMuted: false },
    { string: 3, fret: 2, degree: 3, isRoot: false, isMuted: false },
    { string: 3, fret: 3, degree: 4, isRoot: false, isMuted: false },

    { string: 2, fret: 0, degree: 5, isRoot: false, isMuted: false },
    { string: 2, fret: 2, degree: 6, isRoot: false, isMuted: false },
    { string: 2, fret: 3, degree: "b7", isRoot: false, isMuted: false },

    { string: 1, fret: 1, degree: "R", isRoot: true, isMuted: false },
    { string: 1, fret: 3, degree: 2, isRoot: false, isMuted: false },

    { string: 0, fret: 0, degree: 3, isRoot: false, isMuted: false },
    { string: 0, fret: 1, degree: 4, isRoot: false, isMuted: false },
    { string: 0, fret: 3, degree: 5, isRoot: false, isMuted: false },
  ],
};
