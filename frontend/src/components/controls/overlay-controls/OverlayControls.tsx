import { useSettings, type Settings } from "../../../context/SettingsContext";
import "./OverlayControls.scss";

const CONTROLS: { label: string; short: string; key: keyof Settings }[] = [
  { label: "Note Names", short: "Notes", key: "showNotes" },
  { label: "Degrees", short: "Degrees", key: "showDegrees" },
  { label: "Triads", short: "Triads", key: "showTriads" },
  { label: "Double Stops", short: "Dbl Stops", key: "showDoubleStops" },
  { label: "1-4-5", short: "1-4-5", key: "show145" },
];

const OverlayControls = () => {
  const { settings, setSettings } = useSettings();

  const toggle = (key: keyof Settings) =>
    setSettings((s: any) => ({
      ...s,
      [key]: !s[key],
      ...(key === "showNotes" && !s.showNotes && { showDegrees: false }),
      ...(key === "showDegrees" && !s.showDegrees && { showNotes: false }),
      ...(key === "showDoubleStops" && {
        showScaleWithDoubleStops: false,
        ...(!s.showDoubleStops && { showTriads: false }),
      }),
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
