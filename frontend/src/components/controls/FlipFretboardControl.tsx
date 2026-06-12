import ControlGroup from "./ControlGroup";
import Toggle from "../toggle/Toggle";

interface FlipFretboardControlProps {
  settings: any;
  setSettings: any;
}

const FlipFretboardControl = ({
  setSettings,
  settings,
}: FlipFretboardControlProps) => {
  return (
    <ControlGroup label="View">
      <Toggle
        label={settings.flipFretboard ? "⇅ Flipped" : "Flip Board"}
        active={settings.flipFretboard}
        onClick={() =>
          setSettings((s: any) => ({
            ...s,
            flipFretboard: !s.flipFretboard,
          }))
        }
      />
      <Toggle
        label={settings.flipStrings ? "⇅ Flipped Strings" : "Flip Strings"}
        active={settings.flipStrings}
        onClick={() =>
          setSettings((s: any) => ({
            ...s,
            flipStrings: !s.flipStrings,
          }))
        }
      />
    </ControlGroup>
  );
};

export default FlipFretboardControl;
