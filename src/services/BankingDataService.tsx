import axios, {AxiosInstance} from 'axios';
import {DataPacket} from "../assets/proto/generated/DataPacket.ts";

const HOST_URL: string = import.meta.env.VITE_HOST;
const TWM_BASE_URL: string = `http://${HOST_URL}:22134`;
const TWM_BANK_ACCOUNT_UPDATE_BALANCE: string = "/central/bank/bank-accounts/bank-account/balance";
const TWM_ALL_BANKS: string = "/central/bank/banks/getBanks";
const TWM_ALL_BANK_ACCOUNTS: string = "/central/bank/bank-accounts/bank-accounts";

function generateApi(timeout: number, useProto: boolean): AxiosInstance {
  return axios.create({
    baseURL: TWM_BASE_URL,
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

export const getAllBanks = async (timeout: number = 3000, useProto: boolean = true) => {
  return fetch(timeout, useProto, TWM_ALL_BANKS, {
    'bankField': 'ALL',
    'search': '',
    'dbType': 'crdb'
  });
}

export const getAllBankAccounts = async (timeout: number = 3000, useProto: boolean = true) => {
  return fetch(timeout, useProto, TWM_ALL_BANK_ACCOUNTS, {
    'bankField': 'CCY',
    'search': 'CAD',
    'dbType': 'crdb'
  });
}

export interface BankBalanceUpdate {
  id: string,
  amount: number,
  db: string;
}

export const updateBankBalanceAmount = async (data: BankBalanceUpdate,
                                              timeout: number = 3000,
                                              useProto: boolean = false) => {
  const dataPacket = new DataPacket();
  dataPacket.stringStringMap.set('id', data.id);
  dataPacket.stringDoubleMap.set('amount', data.amount);
  dataPacket.stringStringMap.set('db', data.db);
  const binaryObject = dataPacket.serializeBinary();
  return post(binaryObject, timeout, useProto, TWM_BANK_ACCOUNT_UPDATE_BALANCE);
};
