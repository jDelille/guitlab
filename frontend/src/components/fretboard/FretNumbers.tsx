import "./Fretboard.scss";

interface Props {
  numberOfFrets: number;
  startFret: number;
}

export default function FretNumbers({ numberOfFrets, startFret }: Props) {
  return (
    <div className="fretNumbers">
      {Array.from({ length: numberOfFrets }, (_, i) => {
        const fretNumber = startFret + i;

        return (
          <div className="fretNumber" key={i}>
            {fretNumber === 0 ? "" : fretNumber}
          </div>
        );
      })}
    </div>
  );
}
