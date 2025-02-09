import "./NetWorthComponent.css";
import {Utils} from "../../utils/Utils.tsx";

const NetWorthComponent = (props: { dataPoints: Map<string, number>; }) => {
  const dataPoints: Map<string, number> = props.dataPoints;

  return (
    <div className={'centralize'}>
      <div className={'row-spread'}>
        <h1>Net Worth: {Utils.formatDollar(dataPoints.get("net-worth"))}</h1>
        <h2>Market: {Utils.formatDollar(dataPoints.get("market"))}</h2>
        <h2>GIC: {Utils.formatDollar(dataPoints.get("gic"))}</h2>
        <h2>Bank: {Utils.formatDollar(dataPoints.get("bank"))}</h2>
        <h2>Other: {Utils.formatDollar(dataPoints.get("other"))}</h2>
      </div>
    </div>
  )
}

export default NetWorthComponent;