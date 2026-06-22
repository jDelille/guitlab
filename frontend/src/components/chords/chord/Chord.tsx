import {
  withAlpha,
  type ChordNote,
  type ChordShape,
  type ShapeName,
} from "../../../constants/CagedChords";
import { SHAPE_COLORS } from "../constants";
import "./Chord.scss";

interface ChordProps {
  shape: ChordShape;
  active: string;
  setActive: (shape: ShapeName) => void;
  showAllCagedScales: boolean;
  showDoubleStops: boolean;
  showScaleWithDoubleStops: boolean;
  setSettings: any;
}

export default function Chord({
  shape,
  active,
  setActive,
  showAllCagedScales,
  showDoubleStops,
  showScaleWithDoubleStops,
  setSettings,
}: ChordProps) {
  const DISPLAY_FRETS = 5;

  const color = SHAPE_COLORS[shape.shape];
  const dimColor = withAlpha(color, 0.55);

  const fretted = shape.notes.filter(
    (n): n is ChordNote & { fret: number } => n.fret !== null,
  );

  const minFret = Math.min(...fretted.map((n) => n.fret));
  const maxFret = Math.max(...fretted.map((n) => n.fret));

  const range = maxFret - minFret + 1;
  const extra = Math.max(0, DISPLAY_FRETS - range);

  const leftPad = Math.floor(extra / 2);

  const startFret = Math.max(0, minFret - leftPad);

  const getNote = (stringIndex: number, fret: number) =>
    shape.notes.find((note) => {
      if (fret === 0 && note.fret === null) {
        return note.string === stringIndex;
      }

      return note.string === stringIndex && note.fret === fret;
    });

  const isActive = active === shape.shape;

  const handleChordClick = (shapeName: ShapeName) => {
    if (showDoubleStops) {
      if (shapeName === active && showScaleWithDoubleStops) {
        setSettings((s: any) => ({ ...s, showScaleWithDoubleStops: false }));
      } else {
        setActive(shapeName);
        setSettings((s: any) => ({ ...s, showScaleWithDoubleStops: true, showAllCagedScales: false }));
      }
    } else {
      setActive(shapeName);
      setSettings((s: any) => ({ ...s, showAllCagedScales: false }));
    }
  };

  return (
    <div
      className="chord-grid"
      onClick={() => handleChordClick(shape.shape)}
      style={{
        boxShadow:
          !showAllCagedScales && isActive && (!showDoubleStops || showScaleWithDoubleStops)
            ? `inset 0 0 0 2px ${color}`
            : undefined,
        opacity:
          showAllCagedScales
            ? 1
            : isActive && (!showDoubleStops || showScaleWithDoubleStops)
              ? 1
              : 0.4,
      }}
    >
      <div className="title">
        <p>{shape.shape} Shape</p>
        <p className="start-fret">Fret {startFret}</p>
      </div>

      {Array.from({ length: DISPLAY_FRETS }).map((_, fretOffset) => {
        const fret = startFret + fretOffset;

        return (
          <div key={fret} className="fret-row">
            <div className="fret-number">{fret}</div>

            {Array.from({ length: 6 }).map((_, stringIndex) => {
              const note = getNote(stringIndex, fret);

              return (
                <div
                  key={`${stringIndex}-${fret}`}
                  className="cell"
                  style={
                    fret === 0
                      ? { borderRight: "none", borderLeft: "none" }
                      : undefined
                  }
                >
                  {note && !note.isMuted && (
                    <>
                      {note.fret === 0 ? (
                        <div className="open" style={{ color }} />
                      ) : (
                        <div
                          className="dot"
                          style={{
                            backgroundColor: note.isRoot ? color : dimColor,
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
