import axios, {AxiosInstance} from 'axios';

const HOST_URL: string = import.meta.env.VITE_HOST;
const ITEM_PRICING_BASE_URL: string = `http://${HOST_URL}:5025`;
const ITEM_PRICING_EXTRACT_END_POINT: string = "/item-pricing/extract";

function generateApi(timeout: number, useProto: boolean): AxiosInstance {
  return axios.create({
    baseURL: ITEM_PRICING_BASE_URL,
    timeout: timeout,
    responseType: useProto ? 'arraybuffer' : 'json',
    headers: {
      'Content-Type': useProto ? 'application/x-protobuf' : 'application/json',
      'Accept': useProto ? 'application/x-protobuf' : 'application/json',
    }
  })
}

async function fetch(timeout: number, useProto: boolean, endPoint: string, params: any) {
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

export const getItemPricingStats = async (startDate: number, endDate: number, timeout: number = 30000, useProto: boolean = true) => {
  return fetch(timeout, useProto, ITEM_PRICING_EXTRACT_END_POINT, {
    'startDate': startDate,
    'endDate': endDate
  });
}
