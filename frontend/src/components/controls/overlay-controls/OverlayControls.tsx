import "./OverlayControls.scss";

interface OverlayControlsProps {
  settings: any;
  setSettings: any;
}

const CONTROLS = [
  { label: "Note Names", short: "Notes", key: "showNotes" },
  { label: "Intervals", short: "Intervals", key: "showIntervals" },
  { label: "All Notes", short: "All", key: "showAllCagedScales" },
  { label: "Triads", short: "Triads", key: "showTriads" },
  { label: "Double Stops", short: "Dbl Stops", key: "showDoubleStops" },
];

const OverlayControls = ({ settings, setSettings }: OverlayControlsProps) => {
  const toggle = (key: string) =>
    setSettings((s: any) => ({
      ...s,
      [key]: !s[key],
      ...(key === "showNotes" && !s.showNotes && { showIntervals: false }),
      ...(key === "showIntervals" && !s.showIntervals && { showNotes: false }),
      ...(key === "showDoubleStops" && { showScaleWithDoubleStops: false, ...((!s.showDoubleStops) && { showTriads: false }) }),
      ...(key === "showTriads" && !s.showTriads && { showDoubleStops: false }),
    }));

  return (
    <div className="overlay-controls">
      {CONTROLS.map(({ label, short, key }) => (
        <button
          key={key}
          className={settings[key] ? "activeBtn" : ""}
          onClick={() => toggle(key)}
        >
          <span className="label-full">{label}</span>
          <span className="label-short">{short}</span>
        </button>
      ))}
    </div>
  );
};

export default OverlayControls;
