function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 999,
        border: active ? "1px solid #1D9E75" : "1px solid #2a2a2a",
        background: active ? "#0F6E56" : "transparent",
        color: active ? "#9FE1CB" : "#888",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

export default Toggle;