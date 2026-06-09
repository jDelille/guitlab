import React, { type Dispatch, type SetStateAction } from "react";
import type { NoteName } from "../../constants/CagedChords";
import "./TopControls.scss";

interface KeyProps {
  keyName: string;
  setKey: Dispatch<SetStateAction<NoteName>>;
}

const Key = ({ keyName, setKey }: KeyProps) => {
  const notes: string[] = [
    "A♭",
    "A",
    "B♭",
    "B",
    "C",
    "D♭",
    "D",
    "E♭",
    "E",
    "F",
    "G♭",
    "G",
  ];

  return (
    <div className="key">
      <label htmlFor="key-select" className="label">
        Key
      </label>

      <select
        id="key-select"
        className="control"
        value={keyName}
        onChange={(e) => setKey(e.target.value as NoteName)}
      >
        {notes.map((note) => (
          <option key={note} value={note}>
            {note}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Key;