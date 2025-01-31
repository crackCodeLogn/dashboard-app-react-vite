import axios, {AxiosInstance} from 'axios';
import {sprintf} from 'sprintf-js';

const HOST_URL: string = import.meta.env.VITE_HOST;
const MARKET_DATA_BASE: string = `http://${HOST_URL}:8083`;
const TICKER_DATA_END_POINT: string = "/mkt?symbol=%s&start=%s&end=%s&original=1";

// http://localhost:8083/mkt?symbol=CM.TO&start=2023-10-01&end=2023-10-09&original=1

function generateApi(timeout: number, useProto: boolean): AxiosInstance {
  return axios.create({
    baseURL: MARKET_DATA_BASE,
    timeout: timeout,
    responseType: useProto ? 'arraybuffer' : 'json',
    headers: {
      'Content-Type': useProto ? 'application/x-protobuf' : 'application/json',
      'Accept': useProto ? 'application/x-protobuf' : 'application/json',
    }
  })
}

export interface MarketTickerData {
  symbol: string,
  start: string,
  end: string
}

export const fetchTickerData = async (data: MarketTickerData,
                                      timeout: number = 10000,
                                      useProto: boolean = false) => {
  let mktEndPoint: string = sprintf(TICKER_DATA_END_POINT, data.symbol, data.start, data.end);
  if (useProto) mktEndPoint = '/proto' + mktEndPoint;

  console.log(mktEndPoint) // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout, useProto);
  try {
    const response = await api.get(mktEndPoint);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};