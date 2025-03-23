import axios, {AxiosInstance} from 'axios';

const HOST_URL: string = import.meta.env.VITE_HOST;
const PORTFOLIO_DATA_BASE_URL: string = `http://${HOST_URL}:40037`;
const PORTFOLIO_NET_MARKET_VALUATIONS_END_POINT: string = "/portfolio/market/valuations";
const PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_END_POINT: string = "/portfolio/market/valuations/account";

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

export const fetchNetMarketValuationsData = async (timeout: number = 3000,
                                                   useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_NET_MARKET_VALUATIONS_END_POINT);
};

export const fetchAccountMarketValuationsData = async (
  accountType: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_ACCOUNT_MARKET_VALUATIONS_END_POINT, {
    'accountType': accountType
  });
};
