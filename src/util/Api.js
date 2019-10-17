import axios from 'axios';
import {store} from '../index'

const instance = axios.create({
  baseURL: `https://sandbox.api.quancy.com.sg/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  config.headers['Authorization'] = `Bearer ${token}`
  
  return config
})

export default instance
