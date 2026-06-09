import ControlGroup from "./ControlGroup";
import Select from "../select/Select";

interface KeyControlProps {
  notes: any;
  settings: any;
  setSettings: any;
}

const KeyControl = ({
  notes,
  settings,
  setSettings,
}: KeyControlProps) => {
  return (
    <ControlGroup label="Key">
      <Select
        value={settings.key}
        options={notes}
        onChange={(key) =>
          setSettings((s: any) => ({
            ...s,
            key,
          }))
        }
        minWidth={68}
      />
    </ControlGroup>
  );
};

export default KeyControl;
