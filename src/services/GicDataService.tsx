import axios, {AxiosInstance} from 'axios';

const HOST_URL: string = import.meta.env.VITE_HOST;
const PORTFOLIO_DATA_BASE_URL: string = `http://${HOST_URL}:40037`;
const PORTFOLIO_GIC_EXPIRIES_DATA_END_POINT: string = "/portfolio/gic/expiries?ccy=CAD";
const PORTFOLIO_GIC_VALUATIONS_DATA_END_POINT: string = "/portfolio/gic/valuations?ccy=CAD";

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

async function fetch(timeout: number, useProto: boolean, endPoint: string) {
  console.log(endPoint); // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout, useProto);
  try {
    const response = await api.get(endPoint);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
}

export const fetchGicExpiriesData = async (timeout: number = 3000,
                                           useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_GIC_EXPIRIES_DATA_END_POINT);
};

export const fetchGicValuationData = async (timeout: number = 3000,
                                            useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_GIC_VALUATIONS_DATA_END_POINT);
};
