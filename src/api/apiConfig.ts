import axios, { AxiosInstance } from 'axios';
import env from '../config/env';

const apiConfig: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

export default apiConfig;