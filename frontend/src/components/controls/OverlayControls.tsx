import ControlGroup from "./ControlGroup";
import Toggle from "../toggle/Toggle";

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
    <ControlGroup label="Overlays">
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
    </ControlGroup>
  );
};

export default OverlayControls;
