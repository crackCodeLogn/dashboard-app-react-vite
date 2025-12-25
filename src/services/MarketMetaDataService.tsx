import axios, {AxiosInstance} from 'axios';
import {DataPacket} from "../assets/proto/generated/DataPacket.ts";

const HOST_URL: string = import.meta.env.VITE_HOST;
const PORTFOLIO_DATA_BASE_URL: string = `http://${HOST_URL}:40037`;
const PORTFOLIO_MARKET_METADATA: string = "/portfolio/market/metadata";
const PORTFOLIO_MARKET_METADATA_MANUAL_UPDATE: string = "/portfolio/manual/market/metadata/";


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

async function deleteOp(timeout: number, useProto: boolean, endPoint: string) {
  console.log(endPoint); // todo - remove post testing
  const api: AxiosInstance = generateApi(timeout, useProto);
  try {
    const response = await api.delete(endPoint);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
}

export const fetchEntireMetaData = async (
  timeout: number = 30000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, PORTFOLIO_MARKET_METADATA);
};

export const fetchMetaDataForImnt = async (
  imnt: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return fetch(timeout, useProto, `${PORTFOLIO_MARKET_METADATA}/${imnt}`);
};

export const postMetaDataForImnt = async (
  imnt: string,
  dataPacket: DataPacket,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return post(dataPacket.serializeBinary(), timeout, useProto, `${PORTFOLIO_MARKET_METADATA}/${imnt}`);
};

export const deleteMetaDataForImnt = async (
  imnt: string,
  timeout: number = 3000,
  useProto: boolean = true) => {
  return deleteOp(timeout, useProto, `${PORTFOLIO_MARKET_METADATA}/${imnt}`);
};

export const deleteEntireMetaData = async (
  timeout: number = 3000,
  useProto: boolean = true) => {
  return deleteOp(timeout, useProto, `${PORTFOLIO_MARKET_METADATA}`);
};

export const postManualEntireMetaData = async (
  dataPacket: DataPacket,
  timeout: number = 30000,
  useProto: boolean = true) => {
  return post(dataPacket.serializeBinary(), timeout, useProto, PORTFOLIO_MARKET_METADATA_MANUAL_UPDATE);
};