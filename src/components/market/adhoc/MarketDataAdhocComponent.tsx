import './MarketDataAdhocComponent.css';
import Chart1, {ChartOneSeriesProps} from "../../../components/chart/echarts/Chart.tsx";
import {fetchTickerData, MarketTickerData} from "../../../services/MarketDataService.tsx";
import CustomError from "../../../components/error/CustomError.tsx";
import {InstrumentType, Ticker} from '../../../assets/proto/generated/MarketData.ts';
import {useEffect, useState} from "react";
import dayjs, {ManipulateType} from "dayjs";
import Table from "react-bootstrap/Table";

const TICKER_DATE_FORMAT: string = 'YYYY-MM-DD';
const TIME_RANGES: TimeRange[] = [
  {name: '7D', val: 7, unit: 'day'},
  {name: '15D', val: 15, unit: 'day'},
  {name: '1M', val: 1, unit: 'month'},
  {name: '3M', val: 3, unit: 'month'},
  {name: '6M', val: 6, unit: 'month'},
  {name: '1Y', val: 1, unit: 'year'},
  {name: '5Y', val: 5, unit: 'year'},
  {name: '10Y', val: 10, unit: 'year'},
]

function yValueFormat(value: number): string {
  return value.toFixed(2);
}

function formatDateFromInt(dateInt: number): string {
  const dateStr = dateInt.toString();

  if (dateStr.length !== 8) {
    throw new Error('Input date must be an 8-digit integer in the format YYYYMMDD.');
  }

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);

  return `${year}-${month}-${day}`;
}

interface TimeRange {
  name: string,
  val: number,
  unit: string
}

export interface TickerData {
  data: { date: string, price: number }[];
  name: string;
  sector: string;
  type: string;
  symbol: string;
}

const MarketDataAdhocComponent = (params: { showTable: boolean }) => {
  const showTable: boolean = params.showTable;
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [timeRangeIndex, setTimeRangeIndex] = useState(6);
  const [tickerData, setTickerData] = useState<Ticker | null>(null);
  const [returnPercent, setReturnPercent] = useState('0');
  const [startPrice, setStartPrice] = useState('0');
  const [endPrice, setEndPrice] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartOneSeriesProps | null>(null);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTickerSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!tickerSymbol) {
      setError(true);
      // setErrorMsg('no input...');
      setIsLoading(false);
      return;
    }

    setChartData(null);
    setTickerData(null);
    setIsLoading(true);
    setError(false);

    fetchMarketData();
  };

  const fetchMarketData = () => {
    const currentDate: string = (dayjs().add(1, 'day').format(TICKER_DATE_FORMAT));
    const timeRange: TimeRange = TIME_RANGES[timeRangeIndex];
    const startDate: string = (dayjs().add(-timeRange.val, timeRange.unit as ManipulateType)).format(TICKER_DATE_FORMAT);

    const mktData: MarketTickerData = {
      symbol: tickerSymbol,
      start: startDate,
      end: currentDate
    }

    fetchTickerData(mktData, undefined, true)
      .then(result => {
        /*if (!result || !result.data || result.data.length === 0) {
          throw new Error(`no ticker data found for ${tickerSymbol}`);
        }*/
        if (!result) {
          throw new Error(`no ticker data found for ${tickerSymbol}`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const ticker: Ticker = Ticker.deserializeBinary(binaryData);
        setTickerData(ticker);

        //calc return percent over time period
        const p1: number = ticker.data[0].price;
        const p2: number = ticker.data[ticker.data.length - 1].price;
        setReturnPercent((((p2 - p1) / p1) * 100.0).toFixed(2));
        setStartPrice(ticker.data[0].price.toFixed(2));
        setEndPrice(ticker.data[ticker.data.length - 1].price.toFixed(2));
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setIsLoading(false);
        setErrorMsg(`error encountered => ${err}`);
      });
  };

  useEffect(() => {
    if (tickerData) {
      // const transformTickerData: TickerData = tickerData as TickerData;
      // const values = transformTickerData.data;
      const values = tickerData.data;
      const xdata = values.map(v => formatDateFromInt(v.date));
      const ydata = values.map(v => yValueFormat(v.price));

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

  const getColor = (valueStr: string): string => {
    const value: number = parseFloat(valueStr);
    if (value > 0) return 'green';
    else if (value < 0) return 'red';
    return 'gray';
  }

  return (
    <div className={'row'}>
      <div className={'row'}>
        <form className={'row-distance-5'} onSubmit={handleTickerSubmit}>
          <label> Enter ticker: </label>
          <input type={"text"}
                 value={tickerSymbol}
                 onChange={(e) => {
                   let val = e.target.value;
                   if (val) val = e.target.value.toUpperCase();
                   setTickerSymbol(val);
                 }}/>
          <select
            value={timeRangeIndex}
            onChange={(e) => setTimeRangeIndex(Number(e.target.value))}>
            {TIME_RANGES.map((range, index) => (
              <option key={index} value={index}>
                {range.name}
              </option>
            ))}
          </select>
          <input type={'submit'}/>
        </form>
      </div>

      {error ? <CustomError errorMsg={errorMsg}/> : ''}

      {chartData
        ? <Chart1 {...chartData}/>
        : (error ? <CustomError errorMsg={'*** NO DATA FOUND ***'}/> :
          (isLoading ? 'loading...' : ''))}

      {(showTable && tickerData)
        ? <Table striped bordered hover variant={'light'} className={'table-custom'}>
          <tbody>
          <tr>
            <td>Name</td>
            <td><strong>{tickerData.name}</strong></td>
          </tr>
          <tr>
            <td>Sector</td>
            <td>{tickerData.sector}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{InstrumentType[tickerData.type]}</td>
          </tr>
          <tr>
            <td>Return over period</td>
            <td style={{color: getColor(returnPercent)}}>{returnPercent}%</td>
          </tr>
          <tr>
            <td>Start price</td>
            <td>${startPrice}</td>
          </tr>
          <tr>
            <td>End price</td>
            <td>${endPrice}</td>
          </tr>
          </tbody>
        </Table>
        : ''}
    </div>
  )
};

export default MarketDataAdhocComponent;