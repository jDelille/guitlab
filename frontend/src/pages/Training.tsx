import { Link } from "react-router-dom";
import "./Training.scss";
import { useEffect, useState } from "react";

const mockStats = {
  gamesPlayed: 24,
  streak: 5,
  totalPoints: 1340,
  bestScores: { "caged-scales": 95, "find-the-root": 88 },
};

const mockLeaderboard = [
  { rank: 1, username: "jdelille", points: 1340 },
  { rank: 2, username: "guitarking", points: 1120 },
  { rank: 3, username: "fretmaster", points: 980 },
  { rank: 4, username: "sixstrings", points: 740 },
  { rank: 5, username: "cagedpro", points: 610 },
];

const mockActivity = [
  {
    drill: "Map the CAGED Scale",
    score: 95,
    key: "C",
    shape: "A",
    date: "Today",
  },
  {
    drill: "Find the Root Notes",
    score: 88,
    key: "G",
    shape: "E",
    date: "Today",
  },
  {
    drill: "Map the Triads",
    score: 72,
    key: "F",
    shape: "C",
    date: "Yesterday",
  },
];

const Training = () => {
  const [drills, setDrills] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/drills")
      .then((res) => res.json())
      .then((data) => setDrills(data));
  }, []);

  return (
    <div className="page-content">
      <div className="header">
        <h1>Training</h1>
        <p>Test your knowledge of the CAGED system</p>
      </div>

      <div className="plans">
        <ul>
          {drills.map((plan) => (
            <li key={plan.id} className="plan">
              <Link to={`/training/${plan.id}`}>
                <span className="difficulty">{plan.difficulty}</span>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="training-bottom">
        <div className="stats">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-value">{mockStats.gamesPlayed}</span>
              <span className="stat-label">Games Played</span>
            </div>
            <div className="stat">
              <span className="stat-value">{mockStats.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat">
              <span className="stat-value">{mockStats.totalPoints}</span>
              <span className="stat-label">Total Points</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {Object.values(mockStats.bestScores)[0]}%
              </span>
              <span className="stat-label">Best Score</span>
            </div>
          </div>
        </div>

        <div className="leaderboard">
          <div className="section-header">
            <h2>Leaderboard</h2>
            <Link to="/leaderboard">View all →</Link>
          </div>
          <ul>
            {mockLeaderboard.map((entry) => (
              <li key={entry.rank} className="leaderboard-entry">
                <span className="rank">#{entry.rank}</span>
                <span className="username">{entry.username}</span>
                <span className="points">{entry.points} pts</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <ul>
            {mockActivity.map((item, i) => (
              <li key={i} className="activity-entry">
                <div className="activity-info">
                  <span className="activity-drill">{item.drill}</span>
                  <span className="activity-meta">
                    {item.key} — Shape {item.shape} · {item.date}
                  </span>
                </div>
                <span className="activity-score">{item.score}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Training;
