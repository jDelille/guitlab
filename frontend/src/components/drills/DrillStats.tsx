import "./DrillStats.scss";

interface Props {
  solved: number;
  total: number;
  points: number;
  rank: string;
  nextRank?: string | null;
  nextRankPoints: number;
}

const DrillStats = ({
  solved,
  total,
  points,
  rank,
  nextRankPoints,
}: Props) => {
  const progress = Math.min((points / nextRankPoints) * 100, 100);

  return (
    <div className="drill-stats">
      <div className="drill-stat">
        <span className="drill-stat__value">
          {solved}
          <span className="drill-stat__total">/{total}</span>
        </span>
        <span className="drill-stat__label">Solved</span>
      </div>

      <div className="drill-stat">
        <span className="drill-stat__value">{points}</span>
        <span className="drill-stat__label">Points</span>
      </div>

      <div className="drill-stat rank">
        <span className="drill-stat__value">{rank}</span>
        <span className="drill-stat__label">Current Rank</span>
      </div>

      <div className="drill-stat progress">
        <div className="rank-progress">
          {/* <div className="rank-progress__labels">
            <span>{rank}</span>
            <span>{nextRank}</span>
          </div> */}
          <div className="rank-progress__bar">
            <div
              className="rank-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="rank-progress__points">
            {points} / {nextRankPoints} pts
          </span>
        </div>
      </div>
    </div>
  );
};

export default DrillStats;
