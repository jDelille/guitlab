import React from "react";
import ControlGroup from "./ControlGroup";
import Toggle from "../toggle/Toggle";

interface FlipFretboardControlProps {
  state: any;
  set: any;
}

const FlipFretboardControl = ({state, set}: FlipFretboardControlProps) => {
  return (
    <ControlGroup label="View">
      <Toggle
        label={state.flipped ? "⇅ Flipped" : "Flip Board"}
        active={state.flipped}
        onClick={() => set({ flipped: !state.flipped })}
      />
      <Toggle
        label={state.flipped ? "⇅ Flipped Strings" : "Flip Strings"}
        active={state.flipped}
        onClick={() => set({ flipped: !state.flipped })}
      />
    </ControlGroup>
  );
};

export default FlipFretboardControl;
