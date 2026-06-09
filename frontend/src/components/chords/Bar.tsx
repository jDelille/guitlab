import './Chords.scss';

interface BarreBarProps {
  fromString: number;
  toString: number;
}

export default function BarreBar({ fromString, toString }: BarreBarProps) {
  const totalStrings = 6 - 1; // max span
  const left = (fromString / totalStrings) * 100;
  const right = 100 - (toString / totalStrings) * 100;

  return (
    <div
      className="barre-bar"
      style={{ left: `${left}%`, right: `${right}%` }}
    />
  );
}