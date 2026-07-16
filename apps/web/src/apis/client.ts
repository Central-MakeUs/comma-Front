import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/api';
import { clearTokens, getTokens, setTokens } from '../utils/tokenStorage';

interface RefreshTokenData {
  accessToken: string;
  refreshToken?: string;
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const SESSION_EXPIRED_EVENT = 'comma:session-expired';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  validateStatus: () => true
});

export const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  validateStatus: () => true
});

let refreshPromise: Promise<string> | null = null;

const emitSessionExpired = () => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
};

export const refreshStoredTokens = async () => {
  const tokens = getTokens();

  if (!tokens?.refreshToken) {
    clearTokens();
    emitSessionExpired();
    throw new Error('No refresh token found.');
  }

  const { data } = await authApiClient.post<ApiResponse<RefreshTokenData>>('/api/auth/reissue', {
    refreshToken: tokens.refreshToken
  });

  if (!data.success || !data.data?.accessToken) {
    clearTokens();
    emitSessionExpired();
    throw new Error(data.message ?? 'Failed to refresh token.');
  }

  const nextTokens = {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken ?? tokens.refreshToken
  };

  setTokens(nextTokens);

  return nextTokens.accessToken;
};

const getRefreshPromise = () => {
  if (!refreshPromise) {
    refreshPromise = refreshStoredTokens().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  const tokens = getTokens();

  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const response = error.response;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await getRefreshPromise();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);
