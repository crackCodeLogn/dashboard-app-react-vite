import Chart1, {ChartOneSeriesProps} from "../chart/echarts/Chart.tsx";
import {Utils} from "../../utils/Utils.tsx";
import {GicValuation} from "../portfolio/PortfolioGicValuationDataComponent.tsx";

const GicValuationDataComponent = (props: { valuationData: GicValuation[]; }) => {
  const gicValuationData: GicValuation[] = props.valuationData;

  function getChartData(gicValuationData: GicValuation[] | null): ChartOneSeriesProps {
    return {
      title: 'GIC Valuation',
      showLegend: false,
      xData: gicValuationData?.map(v => v.date),
      yData: gicValuationData?.map(v => Utils.yValueFormat(v.value))
    };
  }

  return (
    <div>
      <Chart1 {...getChartData(gicValuationData)} />
    </div>
  )
}

export default GicValuationDataComponent;