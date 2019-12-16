import axios from 'axios';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { store } from '../index';
import { removeSession } from '../redux/features/session/sessionSlice';
import { resetState } from '../redux/reducers';

const API_PATH =
  process.env.NODE_ENV === 'production'
    ? `https://api.quancy.com.sg/v1`
    : `https://sandbox.api.quancy.com.sg/v1`;

const instance = axios.create({
  baseURL: API_PATH,
  headers: {
    'Content-Type': 'application/json'
  }
});

const handleRequest = request => {
  const token = Cookies.get('token');
  request.headers['Authorization'] = `Bearer ${token}`;
  return request;
};

const handleSuccess = response => response;
const handleError = err => {
  const status = err?.response?.status;
  switch (status) {
    case 401:
      store.dispatch(removeSession());
      break;
    case 403:
      store.dispatch(removeSession());
      store.dispatch(resetState());
      break;
    default:
      break;
  }
  return Promise.reject(err);
};

instance.interceptors.request.use(handleRequest);
instance.interceptors.response.use(handleSuccess, handleError);

const showErrorMessage = err => {
  const error = err?.response?.data?.error;

  if (!error || error.length <= 0) return;
  const errorItem = error[0];
  message.error(errorItem.message);
};

export const get = async (url, params, notifyError = true) => {
  try {
    const response = await instance.get(url, { params });
    const { data } = response;
    if (!data) return response;
    return data;
  } catch (e) {
    if (notifyError) {
      showErrorMessage(e);
    }
  }
};
export const httpDelete = async (url, params, notifyError = true) => {
  try {
    const response = await instance.delete(url, { params });
    const { data } = response;
    return data;
  } catch (e) {
    if (notifyError) {
      showErrorMessage(e);
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

export const postFile = async (url, file, notifyError = true) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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
