import ControlGroup from "./ControlGroup";
import Select from "../select/Select";

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
    <ControlGroup label="Scale">
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
    </ControlGroup>
  );
};

export default ScaleControl;
