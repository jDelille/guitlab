import Select from "../../select/Select";
import "./TuningControl.scss";

interface TuningControl {
  state: any;
  tunings: any;
  set: any;
}

const TuningControl = ({ state, tunings, set }: TuningControl) => {
  return (
    <div className="tuning-control">
      <Select
        value={state.tuning}
        options={tunings}
        onChange={(v) => set({ tuning: v })}
        minWidth={185}
      />
    </div>
  );
};

export default TuningControl;
