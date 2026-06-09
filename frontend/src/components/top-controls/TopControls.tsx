import Key from "./Key";
import Scales from "./Scales";
import Tunings from "./Tunings";
import Labels from "../bottom-controls/Labels";
import "./TopControls.scss";
import type { Dispatch, SetStateAction } from "react";
import type { NoteName } from "../../constants/CagedChords";

interface TopControlsProps {
  keyName: string;
  setKey: Dispatch<SetStateAction<NoteName>>;
  scale: string;
  setScale: (scale: string) => void;
}

const TopControls = ({
  keyName,
  setKey,
  scale,
  setScale,
}: TopControlsProps) => {
  console.log(scale);
  return (
    <div className="top-controls">
      <div className="group">
        <Key keyName={keyName} setKey={setKey} />
        <Scales scale={scale} setScale={setScale} />
      </div>
      <div className="row">
        {/* <Labels /> */}
        {/* <Tunings /> */}
      </div>
    </div>
  );
};

export default TopControls;
