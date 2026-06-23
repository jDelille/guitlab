import "./DrillStats.scss";

interface Props {
  solved: number;
  total: number;
  points: number;
  rank: string;
  nextRank?: string | null;
  nextRankPoints: number;
}

const DrillStats = ({ solved, total, points, rank, nextRankPoints }: Props) => {
  const progress = Math.min((points / nextRankPoints) * 100, 100);

  return (
    <div className="drill-stats">
      <div className="drill-stats__top">
        <div className="drill-stats__stat">
          <span className="drill-stats__value">
            {solved}<span className="drill-stats__total">/{total}</span>
          </span>
          <span className="drill-stats__label">Solved</span>
        </div>
        <div className="drill-stats__divider" />
        <div className="drill-stats__stat">
          <span className="drill-stats__value">{points}</span>
          <span className="drill-stats__label">Points</span>
        </div>
        <div className="drill-stats__divider" />
        <div className="drill-stats__stat">
          <span className="drill-stats__value drill-stats__value--rank">{rank}</span>
          <span className="drill-stats__label">Rank</span>
        </div>
      </div>
      <div className="drill-stats__progress">
        <div className="drill-stats__bar">
          <div className="drill-stats__fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="drill-stats__pts">{points} / {nextRankPoints} pts to next rank</span>
      </div>
    </div>
  );
};

export default DrillStats;
