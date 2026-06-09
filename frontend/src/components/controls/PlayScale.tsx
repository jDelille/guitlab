import ControlGroup from "./ControlGroup";
import { FaPlay, FaStop } from "react-icons/fa";
import { Divider } from "./Controls";
import { useState } from "react";

type Direction = "asc" | "desc" | "both";

const PlayScale = () => {
  const [bpm, setBpm] = useState(120);
  const [direction, setDirection] = useState<Direction>("asc");
  const [play, setPlay] = useState(false);

  return (
    <ControlGroup label="Play Scale">
      <div className="play">
        {!play ? (
          <FaPlay
            color="white"
            className="play-btn"
            onClick={() => setPlay(true)}
          />
        ) : (
          <FaStop
            color="white"
            className="play-btn"
            onClick={() => setPlay(false)}
          />
        )}

        <div className="group">
          <input
            type="range"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
          <p>{bpm} BPM</p>
        </div>

        <Divider height={20}/>

        <div className="audio-controls">
          <button
            className={direction === "asc" ? "active" : ""}
            onClick={() => setDirection("asc")}
          >
            Asc
          </button>
          <button
            className={direction === "desc" ? "active" : ""}
            onClick={() => setDirection("desc")}
          >
            Desc
          </button>
          <button
            className={direction === "both" ? "active" : ""}
            onClick={() => setDirection("both")}
          >
            Both
          </button>
        </div>
      </div>
    </ControlGroup>
  );
};

export default PlayScale;
