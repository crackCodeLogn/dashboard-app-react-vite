import "./NetWorthComponent.css";
import {Utils} from "../../utils/Utils.tsx";

function getPercentage(mapValue: number | undefined, total: number): string {
  if (mapValue === undefined) return '0.00%';
  return `${Utils.yValueFormat(100 * (mapValue / total))}%`;
}

const NetWorthComponent = (props: { dataPoints: Map<string, number>; }) => {
  const dataPoints: Map<string, number> = props.dataPoints;
  let totalVal = 0.0;
  for (const val of dataPoints.values()) totalVal += val;


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
            <h3>{getPercentage(dataPoints.get("market"), totalVal)}</h3>
          </div>
          <div className="net-worth-item">
            <h2>GIC</h2>
            <h2>{Utils.formatDollar(dataPoints.get("gic"))}</h2>
            <h3>{getPercentage(dataPoints.get("gic"), totalVal)}</h3>
          </div>
          <div className="net-worth-item">
            <h2>Bank</h2>
            <h2>{Utils.formatDollar(dataPoints.get("bank"))}</h2>
            <h3>{getPercentage(dataPoints.get("bank"), totalVal)}</h3>
          </div>
          <div className="net-worth-item">
            <h2>Other</h2>
            <h2>{Utils.formatDollar(dataPoints.get("other"))}</h2>
            <h3>{getPercentage(dataPoints.get("other"), totalVal)}</h3>
          </div>
        </div>
      </div>
    </div>
  );

}

export default NetWorthComponent;