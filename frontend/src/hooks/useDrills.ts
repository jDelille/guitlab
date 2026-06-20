const DRILLS = [
  {
    id: "caged-scales",
    name: "Map the CAGED Scale",
    description: "You're given a key and CAGED shape - mark every scale note on the fretboard.",
    coming_soon: false,
    difficulty: null,
  },
  {
    id: "caged-triads",
    name: "Map the Triads",
    description: "Identify and mark the triad notes within a CAGED shape.",
    coming_soon: true,
    difficulty: null,
  },
  {
    id: "find-the-root",
    name: "Find the Root Notes",
    description: "Given a key, find all root note positions across the entire fretboard.",
    coming_soon: true,
    difficulty: null,
  },
  {
    id: "identify-interval",
    name: "Identify the Interval",
    description: "A note is highlighted - identify its interval relative to the root.",
    coming_soon: true,
    difficulty: null,
  },
];

export function useDrills() {
  return DRILLS;
}
