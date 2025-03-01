// src/api/apiClient.ts
import axios, { AxiosInstance } from 'axios';

const apiConfig: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL!,
  timeout: 15000,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

export default apiConfig