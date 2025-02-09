import "./NetWorthComponent.css";
import {Utils} from "../../utils/Utils.tsx";

const NetWorthComponent = (props: { dataPoints: Map<string, number>; }) => {
  const dataPoints: Map<string, number> = props.dataPoints;

  return (
    <div className="centralize">
      <div className="net-worth-container">
        <div className="net-worth-big">
          <h1>Net worth</h1>
          <h1>{Utils.formatDollar(dataPoints.get("net-worth"))}</h1>
        </div>
        <div className="net-worth-grid">
          <div className="net-worth-item">
            <h2>Market</h2>
            <h2>{Utils.formatDollar(dataPoints.get("market"))}</h2>
          </div>
          <div className="net-worth-item">
            <h2>GIC</h2>
            <h2>{Utils.formatDollar(dataPoints.get("gic"))}</h2>
          </div>
          <div className="net-worth-item">
            <h2>Bank</h2>
            <h2>{Utils.formatDollar(dataPoints.get("bank"))}</h2>
          </div>
          <div className="net-worth-item">
            <h2>Other</h2>
            <h2>{Utils.formatDollar(dataPoints.get("other"))}</h2>
          </div>
        </div>
      </div>
    </div>
  );

}

export default NetWorthComponent;