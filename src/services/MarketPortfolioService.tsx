import axios, {AxiosInstance} from 'axios';
import {DataPacket} from "../assets/proto/generated/DataPacket.ts";

const HOST_URL: string = import.meta.env.VITE_HOST;
const PORTFOLIO_DATA_BASE_URL: string = `http://${HOST_URL}:40037`;
const PORTFOLIO_AGGR_MARKET_VALUATIONS_END_POINT: string = "/portfolio/market/valuations";
const PORTFOLIO_AGGR_MARKET_VALUATIONS_PLOT_END_POINT: string = "/portfolio/market/valuations/plot";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_PLOT_END_POINT: string = "/portfolio/market/valuations/plot/account";
const PORTFOLIO_ACCOUNT_MARKET_DIVIDEND_VALUATIONS_END_POINT: string = "/portfolio/market/valuations/dividends";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_SECTOR_END_POINT: string = "/portfolio/market/valuations/sector/account";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_SECTOR_IMNT_END_POINT: string = "/portfolio/market/valuations/sector-imnt/account";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_BEST_WORST_PERFORMERS_END_POINT: string = "/portfolio/market/valuations/best-worst/account";
const PORTFOLIO_ACCOUNT_MARKET_VALUATION_IMNT_END_POINT: string = "/portfolio/market/valuation/account";
const PORTFOLIO_NET_MARKET_VALUATION_OVERVIEW_METRIC_END_POINT: string = "/portfolio/market/valuations/net";
const PORTFOLIO_ACCOUNT_NET_MARKET_VALUATION_OVERVIEW_METRIC_END_POINT: string = "/portfolio/market/valuations/net/account";
const PORTFOLIO_MARKET_INFO_IMNTS_DIV_YIELD_SECTOR: string = "/portfolio/market/info/imnts/dividend-yield-sector";
const PORTFOLIO_MARKET_CORRELATION_MATRIX_WHOLE: string = "/portfolio/market/correlation/matrix";
const PORTFOLIO_MARKET_CORRELATION_MATRIX_ACCOUNT_TYPE: string = "/portfolio/market/correlation/matrix/";
const PORTFOLIO_MARKET_CORRELATION_MATRIX_SECTORS: string = "/portfolio/market/sector/correlation/matrix";
const PORTFOLIO_MARKET_CORRELATION_MATRIX_TARGETED: string = "/portfolio/market/correlation/matrix";
const PORTFOLIO_MARKET_CORRELATION_ADHOC: string = "/portfolio/market/correlation/adhoc";
const PORTFOLIO_MARKET_NEWS_CORP_ACTIONS: string = "/portfolio/market/news/corp-actions";
const PORTFOLIO_REFRESH: string = "/portfolio/reload/v2k";

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

async function post(data: any, timeout: number, useProto: boolean, endPoint: string) {
  console.log(endPoint); // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout, useProto);
  try {
    const response = await api.post(endPoint, data);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
}

export const fetchAggrMarketValuationsData = async (
  useDividends: boolean = false,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_AGGR_MARKET_VALUATIONS_END_POINT, {
    'divs': useDividends
  });
};

export const fetchAggrMarketValuationsPlotData = async (timeout: number = 3000,
                                                        useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_AGGR_MARKET_VALUATIONS_PLOT_END_POINT);
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
  return fetch(timeout, useProto, PORTFOLIO_MARKET_INFO_IMNTS_DIV_YIELD_SECTOR);
};

export const fetchNetMarketValuationOverviewMetricData = async (
  useDividends: boolean = false,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_NET_MARKET_VALUATION_OVERVIEW_METRIC_END_POINT, {
    'divs': useDividends
  });
};

export const fetchAccountNetMarketValuationOverviewMetricData = async (
  accountType: string,
  useDividends: boolean = false,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_NET_MARKET_VALUATION_OVERVIEW_METRIC_END_POINT, {
    'accountType': accountType,
    'divs': useDividends
  });
};

export const fetchCorrelationMatrixForPortfolio = async (
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_MARKET_CORRELATION_MATRIX_WHOLE, {});
};

export const fetchCorrelationMatrixForAccountType = async (
  accountType: string,
  timeout: number = 30000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_MARKET_CORRELATION_MATRIX_ACCOUNT_TYPE + accountType);
};

export const fetchCorrelationMatrixForSectors = async (
  timeout: number = 30000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_MARKET_CORRELATION_MATRIX_SECTORS);
};

export const fetchCorrelationMatrixForSelectedInstruments = async (
  dataPacket: DataPacket,
  timeout: number = 30000,
  useProto: boolean = true) => {
  return post(dataPacket, timeout, useProto, PORTFOLIO_MARKET_CORRELATION_ADHOC);
};

export const fetchCorrelation = async (
  imnt1: string,
  imnt2: string,
  timeout: number = 30000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_MARKET_CORRELATION_ADHOC, {
    'imnt1': imnt1,
    'imnt2': imnt2
  });
};

export const fetchNewsCorporateActions = async (
  timeout: number = 10000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_MARKET_NEWS_CORP_ACTIONS);
};

export const performRefresh = async (
  hardRefresh: boolean = false,
  timeout: number = 300000,
  useProto: boolean = false) => {

  return fetch(timeout, useProto, PORTFOLIO_REFRESH, {
    'hardRefresh': hardRefresh
  });
}
