import axios from 'axios';
import { message } from 'antd';
import { store } from '../index';

const API_PATH = `https://sandbox.api.quancy.com.sg/v1`;

const instance = axios.create({
  baseURL: API_PATH,
  headers: {
    'Content-Type': 'application/json'
  }
});

const handleRequest = request => {
  const token = store.getState().auth.token;
  request.headers['Authorization'] = `Bearer ${token}`;
  return request;
};

const handleSuccess = response => response;
const handleError = err => {
  return Promise.reject(err);
};

instance.interceptors.request.use(handleRequest);
instance.interceptors.response.use(handleSuccess, handleError);

const showErrorMessage = err => {
  const { response } = err;
  const { data } = response;
  const { error } = data;
  const errorItem = error[0];
  message.error(errorItem.message);
};

export const get = async (url, params, notifyError = true) => {
  try {
    const response = await instance.get(url, { params });
    const { data } = response;
    return data;
  } catch (e) {
    if (notifyError) {
      showErrorMessage();
    }
  }
};

export const post = async (url, params, notifyError = true) => {
  try {
    const response = await instance.post(url, params);
    const { data } = response;
    return data;
  } catch (e) {
    if (notifyError) {
      showErrorMessage(e);
    }
  }
};
export const patch = async (url, params, notifyError = true) => {
  try {
    const response = await instance.patch(url, params);
    const { data } = response;
    return data;
  } catch (e) {
    if (notifyError) {
      showErrorMessage(e);
    }
  }
};

export default instance;
