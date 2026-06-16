import React from "react";
import { useParams, Link } from "react-router-dom";
import CagedScalesDrill from "../components/drills/CagedScalesDrill";
import "./Drill.scss";

const DRILL_MAP: Record<string, React.ReactNode> = {
  "caged-scales": <CagedScalesDrill />,
};

const Drill = () => {
  const { drillId } = useParams<{ drillId: string }>();
  const drill = drillId ? DRILL_MAP[drillId] : null;

  if (!drill) {
    return (
      <div className="drill-page">
        <Link to="/training" className="back">← Back to Training</Link>
        <p style={{ color: "white" }}>Drill not found.</p>
      </div>
    );
  }

  return drill;
};

export default Drill;
