import { useRef, useState } from "react";
import Fretboard from "../components/fretboard/Fretboard";
import TabSheet from "../components/tab-creator/TabSheet";
import { playTab } from "../audio/playScale";
import { NOTES } from "../components/fretboard/fretboardUtils";
import './TabCreator.scss';

type TabNote = { string: number; fret: number };
type TabColumn = TabNote[];
type ActivePositions = TabNote[] | null;
type Mode = "note" | "chord";
type ChordQuality = "major" | "minor" | "dom7";

interface TabSection {
  id: string;
  chordRoot: string;
  chordQuality: ChordQuality;
  columns: TabColumn[];
}

const QUALITY_SUFFIX: Record<ChordQuality, string> = {
  major: "",
  minor: "m",
  dom7: "7",
};

let nextSectionId = 0;

const TabCreator = () => {
  const [sections, setSections] = useState<TabSection[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [newSectionRoot, setNewSectionRoot] = useState(NOTES[0]);
  const [newSectionQuality, setNewSectionQuality] = useState<ChordQuality>("major");
  const [bpm, setBpm] = useState(120);
  const [pendingChord, setPendingChord] = useState<TabNote[]>([]);
  const [mode, setMode] = useState<Mode>("note");
  const [activePositions, setActivePositions] = useState<ActivePositions>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const activeSection = sections.find((section) => {
    return section.id === activeSectionId;
  });

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode);
    setPendingChord([]);
  };

  const handleAddSection = () => {
    const id = `section-${nextSectionId}`;
    nextSectionId += 1;
    const section: TabSection = {
      id,
      chordRoot: newSectionRoot,
      chordQuality: newSectionQuality,
      columns: [],
    };
    setSections((prev) => {
      return [...prev, section];
    });
    setActiveSectionId(id);
  };

  const handleDeleteSection = (id: string) => {
    handleStop();
    setSections((prev) => {
      return prev.filter((section) => {
        return section.id !== id;
      });
    });
    if (activeSectionId === id) {
      setActiveSectionId(null);
    }
  };

  const handleNoteEntry = (string: number, fret: number) => {
    if (!activeSectionId) {
      return;
    }
    if (mode === "chord") {
      setPendingChord((prev) => {
        const withoutString = prev.filter((n) => {
          return n.string !== string;
        });
        return [...withoutString, { string, fret }];
      });
      return;
    }
    setSections((prev) => {
      return prev.map((section) => {
        if (section.id !== activeSectionId) {
          return section;
        }
        return { ...section, columns: [...section.columns, [{ string, fret }]] };
      });
    });
  };

  const handleAddChord = () => {
    if (pendingChord.length === 0 || !activeSectionId) {
      return;
    }
    setSections((prev) => {
      return prev.map((section) => {
        if (section.id !== activeSectionId) {
          return section;
        }
        return { ...section, columns: [...section.columns, pendingChord] };
      });
    });
    setPendingChord([]);
  };

  const handleDeleteLast = () => {
    if (!activeSectionId) {
      return;
    }
    setSections((prev) => {
      return prev.map((section) => {
        if (section.id !== activeSectionId) {
          return section;
        }
        return { ...section, columns: section.columns.slice(0, -1) };
      });
    });
  };

  const handleClearSection = () => {
    if (!activeSectionId) {
      return;
    }
    handleStop();
    setSections((prev) => {
      return prev.map((section) => {
        if (section.id !== activeSectionId) {
          return section;
        }
        return { ...section, columns: [] };
      });
    });
    setPendingChord([]);
  };

  const handlePlaySection = async (section: TabSection) => {
    if (section.columns.length === 0 || playingId !== null) {
      return;
    }
    setPlayingId(section.id);
    const stop = await playTab(
      section.columns,
      bpm,
      (positions) => {
        setActivePositions(positions);
      },
      () => {
        setPlayingId(null);
      },
      true,
    );
    stopRef.current = stop;
  };

  const handlePlayAll = async () => {
    const allColumns = sections.flatMap((section) => {
      return section.columns;
    });
    if (allColumns.length === 0 || playingId !== null) {
      return;
    }
    setPlayingId("all");
    const stop = await playTab(
      allColumns,
      bpm,
      (positions) => {
        setActivePositions(positions);
      },
      () => {
        setPlayingId(null);
      },
    );
    stopRef.current = stop;
  };

  const handleStop = () => {
    stopRef.current?.();
    setPlayingId(null);
    setActivePositions(null);
  };

  return (
    <div className="page-content">
      <div className="tab-creator-layout">
        <div className="tab-creator-header">
          <h1>Tab Creator</h1>
          <div className="mode-toggle">
            <button
              className={mode === "note" ? "active" : ""}
              onClick={() => {
                handleModeChange("note");
              }}
            >
              Note
            </button>
            <button
              className={mode === "chord" ? "active" : ""}
              onClick={() => {
                handleModeChange("chord");
              }}
            >
              Chord
            </button>
          </div>
          {mode === "chord" && (
            <button onClick={handleAddChord} disabled={pendingChord.length === 0}>
              Add Chord
            </button>
          )}
          <button onClick={handleDeleteLast} disabled={!activeSection || activeSection.columns.length === 0}>
            Delete Last
          </button>
          <button onClick={handleClearSection} disabled={!activeSection || activeSection.columns.length === 0}>
            Clear Section
          </button>
          <div className="bpm-control">
            <input
              type="range"
              min={40}
              max={240}
              value={bpm}
              onChange={(event) => {
                setBpm(Number(event.target.value));
              }}
              aria-label="BPM"
            />
            <span>{bpm} BPM</span>
          </div>
          <button
            onClick={playingId === "all" ? handleStop : handlePlayAll}
            disabled={sections.length === 0 || (playingId !== null && playingId !== "all")}
          >
            {playingId === "all" ? "Stop" : "Play All"}
          </button>
        </div>

        <div className="new-section-controls">
          <select
            value={newSectionRoot}
            onChange={(event) => {
              setNewSectionRoot(event.target.value);
            }}
          >
            {NOTES.map((note) => {
              return (
                <option key={note} value={note}>
                  {note}
                </option>
              );
            })}
          </select>
          <div className="quality-toggle">
            <button
              className={newSectionQuality === "major" ? "active" : ""}
              onClick={() => {
                setNewSectionQuality("major");
              }}
            >
              Major
            </button>
            <button
              className={newSectionQuality === "minor" ? "active" : ""}
              onClick={() => {
                setNewSectionQuality("minor");
              }}
            >
              Minor
            </button>
            <button
              className={newSectionQuality === "dom7" ? "active" : ""}
              onClick={() => {
                setNewSectionQuality("dom7");
              }}
            >
              Dom7
            </button>
          </div>
          <button onClick={handleAddSection}>+ New Section</button>
        </div>

        <Fretboard
          cagedChord="C"
          selectedShapes={new Set()}
          showChordTones={false}
          activePositions={activePositions}
          lickNotes={null}
          onNoteClick={handleNoteEntry}
        />

        <div className="tab-sections">
          {sections.length === 0 && (
            <p className="tab-sections-empty">
              Create a section above to start tabbing.
            </p>
          )}
          {sections.map((section) => {
            const isActive = section.id === activeSectionId;
            const isPlayingThis = playingId === section.id;

            return (
              <div
                key={section.id}
                className={isActive ? "tab-section active" : "tab-section"}
              >
                <div className="tab-section-header">
                  <button
                    className="section-chord-label"
                    onClick={() => {
                      setActiveSectionId(section.id);
                    }}
                  >
                    {section.chordRoot}
                    {QUALITY_SUFFIX[section.chordQuality]}
                  </button>
                  <button
                    onClick={() => {
                      if (isPlayingThis) {
                        handleStop();
                        return;
                      }
                      handlePlaySection(section);
                    }}
                    disabled={
                      section.columns.length === 0 ||
                      (playingId !== null && !isPlayingThis)
                    }
                  >
                    {isPlayingThis ? "Stop" : "Loop"}
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteSection(section.id);
                    }}
                  >
                    ×
                  </button>
                </div>
                <TabSheet
                  columns={section.columns}
                  pendingChord={isActive ? pendingChord : []}
                  onManualEntry={handleNoteEntry}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabCreator;
