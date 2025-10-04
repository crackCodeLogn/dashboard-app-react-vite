import axios, {AxiosInstance} from 'axios';

const HOST_URL: string = import.meta.env.VITE_HOST;
const PORTFOLIO_DATA_BASE_URL: string = `http://${HOST_URL}:40037`;
const PORTFOLIO_NET_MARKET_VALUATIONS_END_POINT: string = "/portfolio/market/valuations";
const PORTFOLIO_NET_MARKET_VALUATIONS_PLOT_END_POINT: string = "/portfolio/market/valuations/plot";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_PLOT_END_POINT: string = "/portfolio/market/valuations/plot/account";
const PORTFOLIO_ACCOUNT_MARKET_DIVIDEND_VALUATIONS_END_POINT: string = "/portfolio/market/valuations/dividends";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_SECTOR_END_POINT: string = "/portfolio/market/valuations/sector/account";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_SECTOR_IMNT_END_POINT: string = "/portfolio/market/valuations/sector-imnt/account";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_BEST_WORST_PERFORMERS_END_POINT: string = "/portfolio/market/valuations/best-worst/account";
const PORTFOLIO_ACCOUNT_MARKET_VALUATION_IMNT_END_POINT: string = "/portfolio/market/valuation/account";
const PORTFOLIO_MARKET_INFO_IMNTS_DIV_YEILD_SECTOR: string = "/portfolio/market/info/imnts/dividend-yield-sector";

function generateApi(timeout: number, useProto: boolean): AxiosInstance {
  return axios.create({
    baseURL: PORTFOLIO_DATA_BASE_URL,
    timeout: timeout,
    responseType: useProto ? 'arraybuffer' : 'json',
    headers: {
      'Content-Type': useProto ? 'application/x-protobuf' : 'application/json',
      'Accept': useProto ? 'application/x-protobuf' : 'application/json',
    }
  })
}

async function fetch(timeout: number, useProto: boolean, endPoint: string, params: any = {}) {
  console.log(endPoint); // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout, useProto);
  try {
    const response = await api.get(endPoint, {params});
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
}

export const fetchNetMarketValuationsData = async (
  useDividends: boolean = false,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_NET_MARKET_VALUATIONS_END_POINT, {
    'divs': useDividends
  });
};

export const fetchNetMarketValuationsPlotData = async (timeout: number = 3000,
                                                       useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_NET_MARKET_VALUATIONS_PLOT_END_POINT);
};

export const fetchAccountMarketValuationsPlotData = async (
  accountType: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_PLOT_END_POINT, {
    'accountType': accountType
  });
};

export const fetchAccountMarketDividendValuationsData = async (
  accountType: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_MARKET_DIVIDEND_VALUATIONS_END_POINT, {
    'accountType': accountType
  });
};

export const fetchAccountMarketSectorValuationsData = async (
  accountType: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_SECTOR_END_POINT, {
    'accountType': accountType
  });
};

export const fetchAccountMarketSectorImntValuationsData = async (
  accountType: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_SECTOR_IMNT_END_POINT, {
    'accountType': accountType
  });
};

export const fetchAccountMarketValuationsBestAndWorstPerformersData = async (
  accountType: string,
  n: number = 10,
  useDividends: boolean = false,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_BEST_WORST_PERFORMERS_END_POINT, {
    'accountType': accountType,
    'n': n,
    'divs': useDividends
  });
};

export const fetchAccountMarketImntValuationData = async (
  imnt: string,
  accountType: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_MARKET_VALUATION_IMNT_END_POINT, {
    'imnt': imnt,
    'accountType': accountType
  });
};

export const fetchDividendYieldAndSectorForAllImnts = async (
  timeout: number = 30000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_MARKET_INFO_IMNTS_DIV_YEILD_SECTOR);
};