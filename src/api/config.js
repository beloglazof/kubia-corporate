import axios from 'axios';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { store } from '../index';
import { userSignOut } from '../appRedux/actions';

const API_PATH = `https://sandbox.api.quancy.com.sg/v1`;

const instance = axios.create({
  baseURL: API_PATH,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: status => status < 400
});

const handleRequest = request => {
  const token = Cookies.get('token');
  request.headers['Authorization'] = `Bearer ${token}`;
  return request;
};

const handleSuccess = response => response;
const handleError = err => {
  // console.log(err.toJSON());
  const status = err?.response?.status;
  if (status === 403) {
    store.dispatch(userSignOut());
  }
  return Promise.reject(err);
};

instance.interceptors.request.use(handleRequest);
instance.interceptors.response.use(handleSuccess, handleError);

const showErrorMessage = err => {
  const { response } = err;
  if (!response) return;
  const { data } = response;
  if (!data) return;
  const { error } = data;
  if (!error || error.length <= 0) return;
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
