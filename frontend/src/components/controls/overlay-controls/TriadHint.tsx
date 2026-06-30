import { useEffect, useState } from "react";
import "./TriadHint.scss";

const STORAGE_KEY = "guitlab_triad_hint_dismissed";
const ANIM_MS = 220;

interface Props {
  visible: boolean;
}

const TriadHint = ({ visible }: Props) => {
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (visible && !localStorage.getItem(STORAGE_KEY)) {
      setRendered(true);
      setClosing(false);
    }
  }, [visible]);

  const dismiss = (permanently: boolean) => {
    if (permanently) localStorage.setItem(STORAGE_KEY, "1");
    setClosing(true);
    setTimeout(() => setRendered(false), ANIM_MS);
  };

  if (!rendered) return null;

  return (
    <div className={`triad-hint${closing ? " triad-hint--closing" : ""}`}>
      <p className="triad-hint__text">
        Select a CAGED shape to see its triad positions on the neck.
      </p>
      <p className="triad-hint__text">
        Click the play button to see how each triad should be played and how it sounds.
      </p>
      <div className="triad-hint__actions">
        <button className="triad-hint__btn triad-hint__btn--mute" onClick={() => dismiss(true)}>
          Don't show again
        </button>
        <button className="triad-hint__btn" onClick={() => dismiss(false)}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default TriadHint;
