import Chart1, {ChartOneSeriesProps} from "../components/chart/echarts/Chart.tsx";
import {fetchTickerData, MarketTickerData} from "../services/MarketDataService.tsx";
import {useEffect, useState} from "react";
import './Shared.css';

function YValueFormat(value: number): string {
  return value.toFixed(2);
}

export interface TickerData {
  data: { date: string, price: number }[];
}

const MarketDataAdhoc = () => {
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartOneSeriesProps | null>(null);
  const [error, setError] = useState(false);

  const handleTickerSubmit = (event) => {
    event.preventDefault();
    setChartData(null);
    setIsLoading(false);
    setError(false);

    fetchMarketData();
  };

  const fetchMarketData = () => {
    const mktData: MarketTickerData = {
      symbol: tickerSymbol,
      start: '2020-01-01',
      end: '2025-01-25'
    }

    fetchTickerData(mktData, 1000)
      .then(result => {
        if (!result || !result.data || result.data.length === 0) {
          throw new Error(`no ticker data found for ${tickerSymbol}`);
        }
        setTickerData(result);
      }).catch(err => {
      console.error(err);
      setError(true);
    });
  };

  useEffect(() => {
    if (tickerData) {
      const transformTickerData: TickerData = tickerData as TickerData;
      const values = transformTickerData.data;
      const xdata = values.map(v => v.date);
      const ydata = values.map(v => YValueFormat(v.price));

      const chartData: ChartOneSeriesProps = {
        title: `Price chart of ${tickerSymbol}`,
        showLegend: false,
        xData: xdata,
        yData: ydata
      }
      setChartData(chartData);
      setIsLoading(false);
    }
  }, [tickerData]);

  return (
    <div>
      <div className={'row'}>
        <h1> Market Adhoc Inquiry </h1>
        <form className={'row-distance-5'} onSubmit={handleTickerSubmit}>
          <label> Enter ticker: </label>
          <input type={"text"}
                 value={tickerSymbol}
                 onChange={(e) => setTickerSymbol(e.target.value)}/>
          <input type={'submit'}/>
        </form>
      </div>

      {chartData
        ? <Chart1 {...chartData}/>
        : (isLoading ? '' :
          (error ? '*** NO DATA FOUND ***' : ''))}
    </div>
  )
};

export default MarketDataAdhoc;