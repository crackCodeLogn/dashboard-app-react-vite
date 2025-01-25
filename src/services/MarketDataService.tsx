import axios, {AxiosInstance} from 'axios';
import {sprintf} from 'sprintf-js';

const MARKET_DATA_BASE: string = "http://localhost:8083"
const TICKER_DATA_END_POINT: string = "/mkt?symbol=%s&start=%s&end=%s&original=1";

// http://localhost:8083/mkt?symbol=CM.TO&start=2023-10-01&end=2023-10-09&original=1

function generateApi(timeout: number): AxiosInstance {
  return axios.create({
    baseURL: MARKET_DATA_BASE,
    timeout: timeout,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export interface MarketTickerData {
  symbol: string,
  start: string,
  end: string
}

export const fetchTickerData = async (data: MarketTickerData, timeout: number = 3000) => {
  const mktEndPoint: string = sprintf(TICKER_DATA_END_POINT, data.symbol, data.start, data.end);
  console.log(mktEndPoint) // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout);
  try {
    const response = await api.get(mktEndPoint);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};