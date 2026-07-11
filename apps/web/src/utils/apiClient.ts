import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

export const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  validateStatus: () => true
});

export const relaxApiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/relaxes`
})