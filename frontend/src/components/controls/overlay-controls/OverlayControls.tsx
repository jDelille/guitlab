import "./OverlayControls.scss";

interface OverlayControlsProps {
  settings: any;
  setSettings: any;
}

const CONTROLS = [
  { label: "Note Names", key: "showNotes" },
  { label: "Intervals", key: "showIntervals" },
  { label: "Triads", key: "showTriads" },
  { label: "All Notes", key: "showAllCagedScales"},
  { label: "3nps", key: "show3Nps"}
  // { label: "Flip Fretboard", key: "flipFretboard" },
  // { label: "Flip Strings", key: "flipStrings" },
];

const OverlayControls = ({ settings, setSettings }: OverlayControlsProps) => {
  const toggle = (key: string) =>
    setSettings((s: any) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="overlay-controls">
      {CONTROLS.map(({ label, key }) => (
        <button
          key={key}
          className={settings[key] ? "activeBtn" : ""}
          onClick={() => toggle(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default OverlayControls;
