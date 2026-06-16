import Select from "../../select/Select";
import "./ScaleControl.scss";

interface ScaleControl {
  scales: any;
  settings: any;
  setSettings: any;
}

const ScaleControl = ({
  scales,
  settings,
  setSettings,
}: ScaleControl) => {
  return (
    <div className="select-control">
      <Select
        value={settings.scale}
        options={scales}
        onChange={(scale) =>
          setSettings((s: any) => ({
            ...s,
            scale,
          }))
        }
        minWidth={165}
      />
    </div>
  );
};

export default ScaleControl;
