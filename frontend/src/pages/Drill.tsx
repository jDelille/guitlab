import { useParams } from "react-router-dom";
import DrillPage from "../components/drills/DrillPage";
import "./Drill.scss";

const Drill = () => {
  useParams<{ drillId: string }>();
  return <DrillPage />;
};

export default Drill;
