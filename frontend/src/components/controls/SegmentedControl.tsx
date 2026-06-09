function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: number[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        background: "#111",
        borderRadius: 8,
        border: "1px solid #2a2a2a",
        overflow: "hidden",
        height: 52,
      }}
    >
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: "5px 10px",
            fontSize: 12,
            fontWeight: 500,
            border: "none",
            borderLeft: i > 0 ? "1px solid #2a2a2a" : "none",
            background: value === opt ? "#0F6E56" : "transparent",
            color: value === opt ? "#9FE1CB" : "#666",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
