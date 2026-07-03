import { useState } from "react";
import ChordFinderFretboard from "../components/chord-finder/ChordFinderFretboard";
import "./ChordFinder.scss";

export default function ChordFinder() {
  const [selected, setSelected] = useState<Map<number, number>>(new Map());

  return (
    <div className="chord-finder">
      <div className="chord-finder__header">
        <h1 className="chord-finder__title">Chord Finder</h1>
        <p className="chord-finder__subtitle">
          Click the frets you're playing — we'll identify the chord and show you
          what to do next
        </p>
      </div>

      <ChordFinderFretboard selected={selected} onChange={setSelected} />
    </div>
  );
}
