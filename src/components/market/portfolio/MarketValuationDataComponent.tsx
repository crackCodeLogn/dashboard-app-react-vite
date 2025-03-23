import Chart1, {ChartOneSeriesProps} from "../../chart/echarts/Chart.tsx";
import {Utils} from "../../../utils/Utils.tsx";
import {MarketValuation} from "../../portfolio/PortfolioNetMarketValuationDataComponent.tsx";

const MarketValuationDataComponent = (props: { valuationData: MarketValuation[]; title: string }) => {
  const valuationData: MarketValuation[] = props.valuationData;
  const title: string = props.title;

  function getChartData(valuationData: MarketValuation[] | null): ChartOneSeriesProps {
    return {
      title: title,
      showLegend: false,
      xData: valuationData?.map(v => v.date),
      yData: valuationData?.map(v => Utils.yValueFormat(v.value))
    };
  }

  return (
    <div>
      <Chart1 {...getChartData(valuationData)} />
    </div>
  )
}

export default MarketValuationDataComponent;