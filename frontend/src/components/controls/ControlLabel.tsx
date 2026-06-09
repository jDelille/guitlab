function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export default ControlLabel;