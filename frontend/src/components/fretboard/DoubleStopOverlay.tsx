import type { DoubleStopPair } from "../../constants/doubleStops";
import { getFretCenterX, getStringCenterY, NOTE_RADIUS } from "./fretboardUtils";

interface DoubleStopOverlayProps {
  pairs: DoubleStopPair[];
  containerWidth: number;
}

const DoubleStopOverlay = ({ pairs, containerWidth }: DoubleStopOverlayProps) => (
  <svg
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      overflow: "visible",
      zIndex: 2,
    }}
  >
    {pairs.map(({ strings: pairStrings, frets: pairFrets }, idx) => {
      const x1 = getFretCenterX(pairFrets[0], containerWidth);
      const y1 = getStringCenterY(pairStrings[0]);
      const x2 = getFretCenterX(pairFrets[1], containerWidth);
      const y2 = getStringCenterY(pairStrings[1]);
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const capsuleLen = length + NOTE_RADIUS * 2 + 6;
      const capsuleThick = NOTE_RADIUS * 2 + 8;

      return (
        <rect
          key={idx}
          x={-capsuleLen / 2}
          y={-capsuleThick / 2}
          width={capsuleLen}
          height={capsuleThick}
          rx={capsuleThick / 2}
          ry={capsuleThick / 2}
          fill="rgba(155,89,182,0.1)"
          stroke="rgba(155,89,182,0.65)"
          strokeWidth={1.5}
          transform={`translate(${cx}, ${cy}) rotate(${angle})`}
        />
      );
    })}
  </svg>
);

export default DoubleStopOverlay;
