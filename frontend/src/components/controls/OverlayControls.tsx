import ControlGroup from "./ControlGroup";
import Toggle from "../toggle/Toggle";

interface OverlayControlsProps {
  state: any;
  set: any;
}

const OverlayControls = ({state, set}: OverlayControlsProps) => {
  return (
    <ControlGroup label="Overlays">
      <Toggle
        label="Notes"
        active={state.showNotes}
        onClick={() => set({ showNotes: !state.showNotes })}
      />
      <Toggle
        label="Intervals"
        active={state.showIntervals}
        onClick={() => set({ showIntervals: !state.showIntervals })}
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
