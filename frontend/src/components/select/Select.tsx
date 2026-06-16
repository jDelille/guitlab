function Select({
  value,
  options,
  onChange,
  minWidth = 120,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  minWidth?: number;
}) {
  return (
    <div className="select-wrapper">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
