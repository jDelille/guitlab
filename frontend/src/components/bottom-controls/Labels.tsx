import "./BottomControls.scss";

const Labels = () => {
  const labels = ["Notes", "Degrees", "None"];

  return (
    <div className="labels">
      <p className="label">Labels</p>

      <ul className="options">
        {labels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  );
};

export default Labels;
