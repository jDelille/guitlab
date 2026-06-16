import Toggle from "../../toggle/Toggle";
import "./OverlayControls.scss";

interface OverlayControlsProps {
  state: any;
  set: any;
  settings: any;
  setSettings: any;
}

const OverlayControls = ({
  state,
  set,
  settings,
  setSettings,
}: OverlayControlsProps) => {
  return (
    <div className="overlay-controls">
      <Toggle
        label="Note Names"
        active={settings.showNotes}
        onClick={() =>
          setSettings((s: any) => ({
            ...s,
            showNotes: true,
            showIntervals: false,
          }))
        }
      />

      <Toggle
        label="Intervals"
        active={settings.showIntervals}
        onClick={() =>
          setSettings((s: any) => ({
            ...s,
            showNotes: false,
            showIntervals: true,
          }))
        }
      />
      <Toggle
        label="All Notes"
        active={settings.showAllCagedScales}
        onClick={() =>
          setSettings((s: any) => ({
            ...s,
            showAllCagedScales: !s.showAllCagedScales,
          }))
        }
      />
      <Toggle
        label="Triads"
        active={state.showTriads}
        onClick={() => set({ showTriads: !state.showTriads })}
      />
    </div>
  );
};

export default OverlayControls;
