import ReactECharts from 'echarts-for-react';
import './Chart.css'; // Import the CSS file

export interface ChartOneSeriesProps {
  title: string,
  showLegend: boolean,
  xLabel?: string,
  xData?: string[],
  yLabel?: string,
  yData?: string[],
}

function Chart1(params: ChartOneSeriesProps) {
  const options = {
    title: {
      text: params.title,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: params.showLegend,
      orient: 'horizontal', // Options: 'horizontal', 'vertical'
      top: '10%',
      left: 'center',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      name: params.xLabel,
      type: 'category',
      boundaryGap: false,
      data: params.xData,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: params.yLabel,
        type: 'line',
        data: params.yData,
      }
    ],
  };

  return (
    <div className="my-chart-container">
      <ReactECharts option={options}/>
    </div>
  );
}

export default Chart1;
