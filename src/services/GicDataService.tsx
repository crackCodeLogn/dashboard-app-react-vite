import axios, {AxiosInstance} from 'axios';

const PORTFOLIO_DATA_BASE_URL: string = "http://localhost:40037"
const PORTFOLIO_GIC_DATA_END_POINT: string = "/portfolio/gic/expiries?ccy=CAD";

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

export const fetchGicData = async (timeout: number = 3000,
                                   useProto: boolean = false) => {
  const gicEndPoint: string = PORTFOLIO_GIC_DATA_END_POINT;
  console.log(gicEndPoint); // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout, useProto);
  try {
    const response = await api.get(gicEndPoint);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};