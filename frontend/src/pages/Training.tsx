import { Link } from "react-router-dom";
import { useDrills } from "../hooks/useDrills";
import { useUserStats } from "../hooks/useUserStats";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { getRankInfo } from "../constants/ranks";
import DrillStats from "../components/drills/DrillStats";
import "./Training.scss";

const Training = () => {
  const drills = useDrills();
  const { stats, activity, loading: statsLoading } = useUserStats();
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard();

  return (
    <div className="page-content">
      <div className="header">
        <div>
          <h1>Training</h1>
          <p>Test your knowledge of the CAGED system</p>
        </div>
        {stats &&
          (() => {
            const { rank, nextRank, nextRankPoints } = getRankInfo(
              stats.totalPoints,
            );
            return (
              <DrillStats
                solved={stats.solvedCombos}
                total={35}
                points={stats.totalPoints}
                rank={rank}
                nextRank={nextRank}
                nextRankPoints={nextRankPoints}
              />
            );
          })()}
      </div>

      <div className="plans">
        <ul>
          {drills.map((plan) => (
            <li
              key={plan.id}
              className={`plan ${plan.coming_soon ? "coming-soon" : ""}`}
            >
              {plan.coming_soon ? (
                <div>
                  <span className="difficulty">{plan.difficulty}</span>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <span className="badge">Coming Soon</span>
                </div>
              ) : (
                <Link to={`/training/${plan.id}`}>
                  <span className="difficulty">{plan.difficulty}</span>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <span className="badge">
                    {stats?.totalAttempts && stats?.totalAttempts > 0
                      ? " Continue"
                      : "Start Training"}{" "}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="training-bottom">
        <div className="stats">
          <h2>Your Stats</h2>
          {statsLoading ? (
            <div className="skeleton-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-stat" />
              ))}
            </div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-value">{stats.totalPoints}</span>
                <span className="stat-label">Total Points</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.totalAttempts}</span>
                <span className="stat-label">Attempts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.solvedCombos}</span>
                <span className="stat-label">Combos Solved</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.bestScore}%</span>
                <span className="stat-label">Best Score</span>
              </div>
            </div>
          ) : (
            <p className="stats-empty">Log in to see your stats</p>
          )}
        </div>

        <div className="leaderboard">
          <div className="section-header">
            <h2>Leaderboard</h2>
          </div>
          {leaderboardLoading ? (
            <div className="skeleton-list">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-row" />
              ))}
            </div>
          ) : leaderboard.length ? (
            <ul>
              {leaderboard.map((entry) => (
                <li key={entry.rank} className="leaderboard-entry">
                  <span className="rank">#{entry.rank}</span>
                  <span className="username">{entry.username}</span>
                  <span className="points">{entry.points} pts</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="stats-empty">No entries yet</p>
          )}
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {statsLoading ? (
            <div className="skeleton-list">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-row" />
              ))}
            </div>
          ) : activity.length ? (
            <ul>
              {activity.map((item, i) => (
                <li key={i} className="activity-entry">
                  <div className="activity-info">
                    <span className="activity-drill">{item.drillName}</span>
                    <span className="activity-meta">
                      {item.key} · {item.shape} shape · {item.scale} ·{" "}
                      {item.date}
                    </span>
                  </div>
                  <span className="activity-score">{item.bestScore}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="stats-empty">No activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Training;
