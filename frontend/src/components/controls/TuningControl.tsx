import React from "react";
import ControlGroup from "./ControlGroup";
import Select from "../select/Select";

interface TuningControl {
  state: any;
  tunings: any;
  set: any;
}

const TuningControl = ({state, tunings, set}: TuningControl) => {
  return (
    <ControlGroup label="Tuning">
      <Select
        value={state.tuning}
        options={tunings}
        onChange={(v) => set({ tuning: v })}
        minWidth={185}
      />
    </ControlGroup>
  );
};

export default TuningControl;
