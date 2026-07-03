import { Link } from "react-router-dom";
import { useUserStats } from "../hooks/useUserStats";
import drillGroups from "../data/drills.json";
import "./Training.scss";

const Training = () => {
  const { completedDrills } = useUserStats();

  const DrillBox = ({ drillId }: { drillId: string }) =>
    completedDrills.has(drillId)
      ? <div className="box complete">✓</div>
      : <div className="box" />;

  // const {
  //   leaderboard,
  //   loading: leaderboardLoading,
  //   error: leaderboardError,
  //   retry: retryLeaderboard,
  // } = useLeaderboard();

  return (
    <div className="page-content">

      <div className="training-layout">
               <div className="column">
          <nav className="drills-sidebar">
            {drillGroups.map((group) => (
              <div className="drills-sidebar__group" key={group.title}>
                <p className="drills-sidebar__title">{group.title}</p>
                <ul>
                  {group.drills.map((drill) =>
                    drill.comingSoon ? (
                      <li key={drill.id} className="drills-sidebar__item is-disabled">
                        {drill.name}
                      </li>
                    ) : (
                      <li key={drill.id}>
                        <Link to={drill.path!} className="drills-sidebar__item">
                          {drill.name}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="column">
          <div>
            <h1>The Lab</h1>
            <h2 className="header-desc">
              I know some chords and scales, so why does the fretboard still
              feel like a mystery?
            </h2>
            <p className="p-desc">
              Most guitarists hit this wall. You've learned a few shapes, maybe
              a pentatonic scale, but when you try to move up the neck it falls
              apart. You don't know where you are.
            </p>
            <p className="p-desc">
              The CAGED system fixes that. Every chord, scale, and lick on the
              guitar maps to one of five positions: C, A, G, E, and D. Learn
              those five shapes and their relationships, and the entire
              fretboard becomes readable.
            </p>
            <p className="p-desc">
              Work through the drills below in order. Each one builds on the
              last.
            </p>
          </div>

          {drillGroups.map((group) => (
            <ul className="drills" key={group.title}>
              <p className="drills-title">{group.title}</p>
              <p className="drills-description">{group.description}</p>
              {group.drills.map((drill) =>
                drill.comingSoon ? (
                  <li className="coming-soon" key={drill.id}>
                    <div className="drill-link">
                      <div className="text">
                        <span>{drill.name}</span>
                        <p className="drills-description">{drill.description}</p>
                      </div>
                      <span className="coming-soon-label">Coming soon</span>
                    </div>
                  </li>
                ) : (
                  <li key={drill.id}>
                    <Link to={drill.path!} className="drill-link">
                      <div className="text">
                        <span>{drill.name}</span>
                        <p className="drills-description">{drill.description}</p>
                      </div>
                      <DrillBox drillId={drill.id} />
                    </Link>
                  </li>
                )
              )}
            </ul>
          ))}
        </div>

 
      </div>
    </div>
  );
};

export default Training;
