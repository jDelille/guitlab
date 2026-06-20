function Toggle({
  label,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}

    >
      {label}
    </button>
  );
}

export default Toggle;