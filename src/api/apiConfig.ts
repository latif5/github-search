import axios, { AxiosInstance } from 'axios';

const apiConfig: AxiosInstance = axios.create({
  baseURL: process.env.VITE_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

export default apiConfig