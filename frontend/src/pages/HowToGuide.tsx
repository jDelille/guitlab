import "./HowToGuide.scss";

const HowToGuide = () => {
  return (
    <div className="how-to">
      <div className="how-to__hero">
        <h1>How to use Guitlab</h1>
        <p>Everything you need to unlock the fretboard.</p>
      </div>

      <div className="how-to__content">
        <section className="how-to__section">
          <h2>What is Guitlab?</h2>
          <p>
            Guitlab is an interactive guitar learning tool built around the CAGED system, one of
            the most powerful frameworks for understanding the entire fretboard. Instead of
            memorizing isolated scale shapes, you learn how scales, arpeggios, and chords all
            connect within the same five positions.
          </p>
        </section>

        <section className="how-to__section">
          <h2>The CAGED System</h2>
          <p>
            CAGED stands for the five open chord shapes every guitarist learns early on: <strong>C, A, G, E,
            and D</strong>. These five shapes repeat up the neck and cover the entire fretboard. Every
            key has all five shapes. Once you know them, you always know where you are.
          </p>
          <div className="how-to__shapes">
            {["C", "A", "G", "E", "D"].map((shape) => (
              <div key={shape} className="how-to__shape-badge">{shape}</div>
            ))}
          </div>
          <p>
            The real power comes when you see how the scales, arpeggios, triads, and double stops
            all live inside each shape. Guitlab shows you all of them in one place.
          </p>
        </section>

        <section className="how-to__section">
          <h2>Using the Fretboard</h2>
          <div className="how-to__cards">
            <div className="how-to__card">
              <p className="how-to__card-title">Scales</p>
              <p>See all the notes in a scale within each CAGED shape. Toggle between major, minor, pentatonic, and more.</p>
            </div>
            <div className="how-to__card">
              <p className="how-to__card-title">Arpeggios</p>
              <p>Highlight just the chord tones (root, 3rd, 5th) inside each shape. Essential for targeting strong notes.</p>
            </div>
            <div className="how-to__card">
              <p className="how-to__card-title">Shapes</p>
              <p>Toggle individual CAGED shapes on and off to focus on one position at a time or see how they overlap.</p>
            </div>
            <div className="how-to__card">
              <p className="how-to__card-title">Keys</p>
              <p>Switch between all 12 keys instantly. The shapes stay the same, only the fret positions shift.</p>
            </div>
          </div>
        </section>

        <section className="how-to__section">
          <h2>The Lab</h2>
          <p>
            The Lab is where passive learning becomes active. Drills test your knowledge of CAGED
            shapes by asking you to identify the correct notes on the fretboard. Each drill covers
            all 5 shapes across all 7 keys, 35 combinations total.
          </p>
          <div className="how-to__steps">
            <div className="how-to__step">
              <span className="how-to__step-num">1</span>
              <p>Pick a drill from The Lab. Start with Major CAGED Chords.</p>
            </div>
            <div className="how-to__step">
              <span className="how-to__step-num">2</span>
              <p>A shape and key are shown. Place the correct notes on the fretboard.</p>
            </div>
            <div className="how-to__step">
              <span className="how-to__step-num">3</span>
              <p>Submit your answer and get instant feedback on what you got right.</p>
            </div>
            <div className="how-to__step">
              <span className="how-to__step-num">4</span>
              <p>Complete all 35 combinations to finish the drill and earn the completion badge.</p>
            </div>
          </div>
        </section>

        <section className="how-to__section">
          <h2>Tips for getting the most out of Guitlab</h2>
          <ul className="how-to__tips">
            <li>Start with one key (C major is a good anchor) and learn all 5 shapes before moving to other keys.</li>
            <li>Use the play button to hear each scale. Your ear is part of the learning process.</li>
            <li>Switch the overlay between scale and arpeggio in the same shape to see how they relate.</li>
            <li>Once shapes feel solid on the fretboard, take them to a real jam and apply them in context.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HowToGuide;
