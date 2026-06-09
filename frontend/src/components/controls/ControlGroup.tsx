import ControlLabel from "./ControlLabel";
import "./Controls.scss";

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="control">
      <ControlLabel>{label}</ControlLabel>
      <div
        style={{ display: "flex", gap: 6, alignItems: "center", height: 52 }}
      >
        {children}
      </div>
    </div>
  );
}

export default ControlGroup;
