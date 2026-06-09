import { useState } from "react";
import Fretboard from "./components/fretboard/Fretboard";
import Navbar from "./components/navbar/Navbar";
import Chords from "./components/chords/Chords";
import Controls from "./components/controls/Controls";

function App() {
  const [cagedChord, setCagedChord] = useState<string>("C");
  const [showAllScales, setShowAllScales] = useState<boolean>(false);
  const [showChordTones, setShowChordTones] = useState<boolean>(false);

  const [settings, setSettings] = useState({
    key: "C",
    scale: "majorPentatonic",
    tuning: "standard",
    frets: 15,
    showNotes: true,
    showIntervals: false,
    showTriads: false,
    flipped: false,
  });

  const handleShowAllScales = (val: boolean) => {
    setShowAllScales(val);
  };

  return (
    <div className="page">
      <div className="layout">
        <div className="page-content">
          <Navbar />
          <Controls
            settings={settings}
            setSettings={setSettings}
          />
          <Fretboard
            keyName={settings.key}
            scale={settings.scale}
            cagedChord={cagedChord}
            showAll={showAllScales}
            showChordTones={showChordTones}
          />
          <Chords
            cagedChord={cagedChord}
            setCagedChord={setCagedChord}
            keyName={settings.key}
            showAll={showAllScales}
            setShowAll={handleShowAllScales}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
