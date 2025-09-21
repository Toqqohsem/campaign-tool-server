// client/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_AWS_API_GATEWAY_URL || 'http://localhost:3001/api',
});