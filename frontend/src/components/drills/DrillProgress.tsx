import "./DrillProgress.scss";

interface ComboProgress {
  key: string;
  shape: string;
  bestScore: number | null;
}

interface Props {
  progress: ComboProgress[];
  total: number;
}

const DrillProgress = ({ progress, total }: Props) => {
  const solved = progress.filter((p) => p.bestScore === 100).length;
  const attempted = progress.filter((p) => p.bestScore !== null && p.bestScore < 100).length;
  const remaining = total - solved - attempted;

  return (
    <div className="drill-progress">
      <span className="drill-progress__item solved">
        <span className="dot" />
        {solved} solved
      </span>
      <span className="drill-progress__sep">·</span>
      <span className="drill-progress__item attempted">
        <span className="dot" />
        {attempted} attempted
      </span>
      <span className="drill-progress__sep">·</span>
      <span className="drill-progress__item remaining">
        {remaining} remaining
      </span>
    </div>
  );
};

export default DrillProgress;
