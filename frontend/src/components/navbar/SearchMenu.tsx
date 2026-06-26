import { useSettings } from "../../context/SettingsContext";
import "./SearchMenu.scss";

const KEYS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];

const SCALES = [
  { key: "majorPentatonic", label: "Major Pentatonic" },
  { key: "majorScale", label: "Major Scale" },
  { key: "arpeggio", label: "Arpeggio" },
  { key: "minorPentatonic", label: "Minor Pentatonic" },
  { key: "minorScale", label: "Minor Scale" },
  { key: "minorArpeggio", label: "Minor Arpeggio" },
  { key: "dom7Scale", label: "Dom7 Scale (Mixolydian)" },
  { key: "dom7Arpeggio", label: "Dom7 Arpeggio" },
];

const ALL_RESULTS = KEYS.flatMap((key) =>
  SCALES.map((scale) => ({
    key,
    scale: scale.key,
    label: `${key} ${scale.label}`,
  }))
);

interface Props {
  query: string;
  onClose: () => void;
}

const SearchMenu = ({ query, onClose }: Props) => {
  const { setSettings } = useSettings();

  const results = ALL_RESULTS.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 12);

  const handleSelect = (key: string, scale: string) => {
    setSettings((s: any) => ({ ...s, key, scale }));
    onClose();
  };

  if (!query || results.length === 0) return null;

  return (
    <div className="search-menu">
      <div className="search-menu__handle" />
      <ul>
        {results.map((r) => (
          <li key={r.label}>
            <button
              className="search-menu__result"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(r.key, r.scale);
              }}
            >
              <span className="search-menu__key">{r.key}</span>
              <span className="search-menu__scale">{SCALES.find((s) => s.key === r.scale)?.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchMenu;
