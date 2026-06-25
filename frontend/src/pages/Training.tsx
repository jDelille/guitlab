import { Link } from "react-router-dom";
import { useUserStats } from "../hooks/useUserStats";
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
      <div className="header"></div>

      <div className="training-layout">
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

          <ul className="drills">
            <p className="drills-title">Major CAGED Chords</p>
            <p className="drills-description">
              The foundation of the system - five chord shapes that cover the
              entire neck.
            </p>
            <li>
              <Link to="/drill/major-caged-chords" className="drill-link">
                <div className="text">
                  <span>Major Chords</span>
                  <p className="drills-description">
                    Learn the 5 major chord shapes that make up CAGED
                  </p>
                </div>
                <DrillBox drillId="major-caged-chords" />
              </Link>
            </li>
          </ul>

          <ul className="drills">
            <p className="drills-title">Minor CAGED Chords</p>
            <p className="drills-description">
              The same five positions, reframed - learn to shift between major
              and minor anywhere on the neck.
            </p>
            <li>
              <Link to="/drill/minor-caged-chords" className="drill-link">
                <div className="text">
                  <span>Minor Chords</span>
                  <p className="drills-description">
                    Learn the 5 minor chord shapes that make up CAGED
                  </p>
                </div>
                <DrillBox drillId="minor-caged-chords" />
              </Link>
            </li>
          </ul>

          <ul className="drills">
            <p className="drills-title">Dom7 CAGED Chords</p>
            <p className="drills-description">
              The blues backbone - dominant 7th chords add tension that resolves
              naturally, and knowing all five shapes means you can find that
              sound anywhere on the neck.
            </p>
            <li>
              <Link to="/drill/dom7-caged-chords" className="drill-link">
                <div className="text">
                  <span>Dom7 Chords</span>
                  <p className="drills-description">
                    Learn the 5 dominant 7th chord shapes that make up CAGED
                  </p>
                </div>
                <DrillBox drillId="dom7-caged-chords" />
              </Link>
            </li>
          </ul>

          <ul className="drills">
            <p className="drills-title">Major Scales & Arpeggios</p>
            <p className="drills-description">
              Scales give you the full picture; arpeggios show you the chord
              tones inside them. Together they connect your chord shapes to
              every note on the neck.
            </p>
            <li>
              <Link to="/drill/major-scale" className="drill-link">
                <div className="text">
                  <span>Major Scale</span>
                  <p className="drills-description">
                    Map the major scale across all 5 CAGED positions
                  </p>
                </div>
                <DrillBox drillId="major-scale" />
              </Link>
            </li>
            <li>
              <Link to="/drill/major-pentatonic" className="drill-link">
                <div className="text">
                  <span>Major Pentatonic</span>
                  <p className="drills-description">
                    Map the major pentatonic across all 5 CAGED positions
                  </p>
                </div>
                <DrillBox drillId="major-pentatonic" />
              </Link>
            </li>
            <li>
              <Link to="/drill/major-arpeggio" className="drill-link">
                <div className="text">
                  <span>Major Arpeggio</span>
                  <p className="drills-description">
                    Isolate the chord tones within each major CAGED shape
                  </p>
                </div>
                <DrillBox drillId="major-arpeggio" />
              </Link>
            </li>
          </ul>

          <ul className="drills">
            <p className="drills-title">Minor Scales & Arpeggios</p>
            <p className="drills-description">
              The minor equivalents of the same five positions - essential for
              soloing, understanding key changes, and moving fluidly between
              major and minor tonality.
            </p>
            <li>
              <Link to="/drill/minor-scale" className="drill-link">
                <div className="text">
                  <span>Minor Scale</span>
                  <p className="drills-description">
                    Map the natural minor scale across all 5 CAGED positions
                  </p>
                </div>
                <DrillBox drillId="minor-scale" />
              </Link>
            </li>
            <li>
              <Link to="/drill/minor-pentatonic" className="drill-link">
                <div className="text">
                  <span>Minor Pentatonic</span>
                  <p className="drills-description">
                    Map the minor pentatonic across all 5 CAGED positions
                  </p>
                </div>
                <DrillBox drillId="minor-pentatonic" />
              </Link>
            </li>
            <li>
              <Link to="/drill/minor-arpeggio" className="drill-link">
                <div className="text">
                  <span>Minor Arpeggio</span>
                  <p className="drills-description">
                    Isolate the chord tones within each minor CAGED shape
                  </p>
                </div>
                <DrillBox drillId="minor-arpeggio" />
              </Link>
            </li>
          </ul>

          <ul className="drills">
            <p className="drills-title">Triads</p>
            <p className="drills-description">
              Triads are the three-note core of every chord - knowing where they
              sit inside each CAGED shape is what separates players who solo
              from players who just run scales.
            </p>
            <li className="coming-soon">
              <div className="drill-link">
                <div className="text">
                  <span>Major Triads</span>
                  <p className="drills-description">
                    Identify the major triad shapes within each CAGED position
                  </p>
                </div>
                <span className="coming-soon-label">Coming soon</span>
              </div>
            </li>
            <li className="coming-soon">
              <div className="drill-link">
                <div className="text">
                  <span>Minor Triads</span>
                  <p className="drills-description">
                    Identify the minor triad shapes within each CAGED position
                  </p>
                </div>
                <span className="coming-soon-label">Coming soon</span>
              </div>
            </li>
          </ul>

          <ul className="drills">
            <p className="drills-title">Double Stops</p>
            <p className="drills-description">
              Two notes played together - the building block of country chicken
              pickin', blues fills, and everything in between. Learn to find
              them across the neck and your playing gets texture immediately.
            </p>
            <li className="coming-soon">
              <div className="drill-link">
                <div className="text">
                  <span>Double Stops</span>
                  <p className="drills-description">
                    Locate double stop pairs across all 5 CAGED positions
                  </p>
                </div>
                <span className="coming-soon-label">Coming soon</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="column" />
      </div>
    </div>
  );
};

export default Training;
