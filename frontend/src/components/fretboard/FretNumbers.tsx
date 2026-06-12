import "./Fretboard.scss";

interface Props {
  numberOfFrets: number;
  startFret: number;
  flipped?: boolean;
}

export default function FretNumbers({ numberOfFrets, startFret, flipped }: Props) {
  return (
    <div className={flipped ? "fretNumbers fretNumbersFlipped" : "fretNumbers"}>
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
