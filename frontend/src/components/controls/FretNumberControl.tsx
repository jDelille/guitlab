interface FretNumberControl {
  state: any;
  fret_options: number[];
  set: any;
}

const FretNumberControl = ({ state, fret_options, set }: FretNumberControl) => {
  return (
    <div className="fret-control">
      {fret_options.map((opt) => (
        <button
          key={opt}
          className={`fret-btn ${state.frets === opt ? "fret-btn--active" : ""}`}
          onClick={() => set({ frets: opt })}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default FretNumberControl;
