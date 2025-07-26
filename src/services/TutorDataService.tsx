import axios, {AxiosInstance} from 'axios';

const HOST_URL: string = import.meta.env.VITE_HOST;
const MARKET_DATA_BASE: string = `http://${HOST_URL}:5025`;
const GET_ALL_MODES_END_POINT: string = "/tutor/modes";
const GET_ALL_SUBJECTS_END_POINT: string = "/tutor/subjects";
const POST_SESSION_END_POINT: string = "/tutor/session";
const POST_SESSION_DATA_END_POINT: string = "/tutor/session/data";
const GET_LATEST_SESSION_DATA_END_POINT: string = "/tutor/session/data";

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

export interface Mode {
  id: number,
  name: string,
  color: string
}

export interface Subject {
  id: number,
  name: string,
  modeId: number
}

export interface GetSessionData {
  fileName: string,
  fileData: string
}

export interface Session {
  modeId: number,
  student: string,
  subjectId: number,
  sessionDate: Date,
  sessionStartTime: number,
  sessionLengthInMinutes: number
}

export interface SessionData {
  modeId: number,
  student: string,
  subjectId: number,
  sessionDate: Date,
  data: string
}


export const getAllModes = async (timeout: number = 15000,
                                  useProto: boolean = false) => {
  try {
    const response = await generateApi(timeout, useProto)
      .get(GET_ALL_MODES_END_POINT);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};

export const getAllSubjects = async (timeout: number = 15000,
                                     useProto: boolean = false) => {
  try {
    const response = await generateApi(timeout, useProto)
      .get(GET_ALL_SUBJECTS_END_POINT);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};

export const getLatestSessionData = async (student: string,
                                           timeout: number = 15000,
                                           useProto: boolean = false) => {
  try {
    const response = await generateApi(timeout, useProto)
      .get(GET_LATEST_SESSION_DATA_END_POINT, {
        params: {
          student: student,
        }
      });
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};

export const postSession = async (session: Session,
                                  timeout: number = 15000,
                                  useProto: boolean = false) => {
  try {
    const response = await generateApi(timeout, useProto)
      .post(POST_SESSION_END_POINT, session);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};

export const postSessionData = async (sessionData: SessionData,
                                      timeout: number = 15000,
                                      useProto: boolean = false) => {
  try {
    const response = await generateApi(timeout, useProto)
      .post(POST_SESSION_DATA_END_POINT, sessionData);
    return response.data;
  } catch (error) {
    console.error('api err: ' + error);
    throw error;
  }
};