import axios from 'axios';

export default axios.create({
  baseURL: `https://sandbox.api.quancy.com.sg/v1`,
  headers: {
    'Content-Type': 'application/json',
  }
});
