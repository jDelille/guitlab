import "./KeyControl.scss";

interface KeyControlProps {
  notes: string[];
  settings: any;
  setSettings: any;
}

const KeyControl = ({ notes, settings, setSettings }: KeyControlProps) => {
  return (
    <div className="key-control">
      {notes.map((note) => (
        <button
          key={note}
          className={`key-btn ${settings.key === note ? "key-btn--active" : ""}`}
          onClick={() => setSettings((s: any) => ({ ...s, key: note }))}
        >
          {note}
        </button>
      ))}
    </div>
  );
};

export default KeyControl;
