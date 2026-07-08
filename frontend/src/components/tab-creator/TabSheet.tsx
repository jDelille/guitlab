import { useState } from "react";
import "./TabSheet.scss";

const STRING_LABELS = ["e", "B", "G", "D", "A", "E"];

type TabNote = { string: number; fret: number };
type TabColumn = TabNote[];

interface TabSheetProps {
  columns: TabColumn[];
  pendingChord: TabNote[];
  onManualEntry: (string: number, fret: number) => void;
}

function getFretForString(column: TabColumn, stringIndex: number): number | null {
  const note = column.find((n) => {
    return n.string === stringIndex;
  });
  return note ? note.fret : null;
}

function columnWidth(column: TabColumn): number {
  return Math.max(
    1,
    ...column.map((n) => {
      return String(n.fret).length;
    }),
  );
}

function buildLine(columns: TabColumn[], stringIndex: number): string {
  return columns
    .map((column) => {
      const width = columnWidth(column);
      const fret = getFretForString(column, stringIndex);
      if (fret !== null) {
        return String(fret).padStart(width, "-");
      }
      return "-".repeat(width);
    })
    .join("-");
}

const TabSheet = ({ columns, pendingChord, onManualEntry }: TabSheetProps) => {
  const [drafts, setDrafts] = useState<string[]>(["", "", "", "", "", ""]);

  const handleDraftChange = (stringIndex: number, value: string) => {
    setDrafts((prev) => {
      const next = [...prev];
      next[stringIndex] = value;
      return next;
    });
  };

  const handleDraftSubmit = (stringIndex: number) => {
    const value = drafts[stringIndex];
    if (value.trim() === "") {
      return;
    }
    const fret = Number(value);
    if (Number.isNaN(fret) || fret < 0) {
      return;
    }
    onManualEntry(stringIndex, fret);
    handleDraftChange(stringIndex, "");
  };

  return (
    <div className="tab-sheet">
      {STRING_LABELS.map((label, stringIndex) => {
        const committedLine = buildLine(columns, stringIndex);
        const pendingFret =
          pendingChord.length > 0
            ? getFretForString(pendingChord, stringIndex)
            : null;

        return (
          <div className="tab-sheet-string" key={label}>
            <span className="string-label">{label}</span>
            <span className="string-line">
              |{committedLine}
              {pendingChord.length > 0 && (
                <span className="pending-note">
                  -{pendingFret !== null ? pendingFret : "-"}
                </span>
              )}
              |
            </span>
            <input
              className="manual-entry"
              type="number"
              min={0}
              value={drafts[stringIndex]}
              onChange={(event) => {
                handleDraftChange(stringIndex, event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleDraftSubmit(stringIndex);
                }
              }}
              placeholder="-"
            />
          </div>
        );
      })}
    </div>
  );
};

export default TabSheet;
