import axios, {AxiosInstance} from 'axios';

const HOST_URL: string = import.meta.env.VITE_HOST;
const EXPIRY_DATA_BASE_URL: string = `http://${HOST_URL}:5025`;
const EXPIRY_DATA_END_POINT: string = "/expiry/";

function generateApi(timeout: number, useProto: boolean): AxiosInstance {
  return axios.create({
    baseURL: EXPIRY_DATA_BASE_URL,
    timeout: timeout,
    responseType: useProto ? 'arraybuffer' : 'json',
    headers: {
      'Content-Type': useProto ? 'application/x-protobuf' : 'application/json',
      'Accept': useProto ? 'application/x-protobuf' : 'application/json',
    }
  })
}

export interface ExpiryData {
  date: Date,
  data: string
}

export const submitExpiryData = async (data: ExpiryData,
                                       timeout: number = 3000,
                                       useProto: boolean = false) => {
  const expiryEndpoint: string = EXPIRY_DATA_END_POINT;
  console.log(expiryEndpoint); // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout, useProto);
  try {
    const response = await api.post(expiryEndpoint, data);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};