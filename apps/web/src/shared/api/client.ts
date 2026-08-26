import { NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR } from '@comma/bridge';
import axios, {
  type AxiosAdapter,
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
import { appBridge } from '../bridge/bridge';
import {
  clearTokens,
  getTokens,
  setOnboardingCompleted,
  setTokens,
  shouldUseNativeAuthBridge
} from '../lib/tokenStorage';
import type { ApiResponse } from '../types/api';
import { SESSION_EXPIRED_ERROR_MESSAGE } from './errors';

export { SESSION_EXPIRED_ERROR_MESSAGE } from './errors';

interface RefreshTokenData {
  accessToken: string;
  refreshToken?: string;
  onboardingCompleted?: boolean;
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

let refreshPromise: Promise<string | null> | null = null;
let hasEmittedSessionExpired = false;

const parseRequestBody = (data: unknown) => {
  if (typeof data !== 'string') return data;

  try {
    return JSON.parse(data) as unknown;
  } catch {
    return data;
  }
};

const nativeApiAdapter: AxiosAdapter = async (config) => {
  if (config.data instanceof FormData) {
    throw new Error('Native FormData requests must use a dedicated native bridge method.');
  }

  const method = config.method?.toUpperCase();
  if (!method || !['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    throw new Error(`Unsupported native API method: ${method ?? 'unknown'}`);
  }

  const result = await appBridge.authenticatedRequest({
    method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: config.url ?? '',
    params: config.params as
      | Record<string, string | number | boolean | null | undefined>
      | undefined,
    body: config.data === undefined ? undefined : parseRequestBody(config.data)
  });
  const response: AxiosResponse = {
    data: result.data,
    status: result.status,
    statusText: String(result.status),
    headers: {},
    config
  };

  if (result.status < 200 || result.status >= 300) {
    throw new AxiosError(
      `Request failed with status code ${result.status}`,
      AxiosError.ERR_BAD_RESPONSE,
      config,
      undefined,
      response
    );
  }

  return response;
};

const emitSessionExpired = () => {
  if (typeof window === 'undefined') return;
  if (hasEmittedSessionExpired) return;

  hasEmittedSessionExpired = true;
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
};

export const expireSession = async () => {
  try {
    await clearTokens();
  } finally {
    emitSessionExpired();
  }
};

export const resetSessionExpiredState = () => {
  hasEmittedSessionExpired = false;
};

const performStoredTokenRefresh = async () => {
  if (shouldUseNativeAuthBridge()) {
    try {
      const result = await appBridge.refreshAuthSession();
      if (typeof result.onboardingCompleted === 'boolean') {
        setOnboardingCompleted(result.onboardingCompleted);
      }
      resetSessionExpiredState();
      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR)) {
        await expireSession();
        throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
      }
      throw error;
    }
  }

  const tokens = getTokens();

  if (!tokens?.refreshToken) {
    await expireSession();
    throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
  }

  const { data } = await authApiClient.post<ApiResponse<RefreshTokenData>>('/api/auth/reissue', {
    refreshToken: tokens.refreshToken
  });

  if (!data.success || !data.data?.accessToken) {
    await expireSession();
    throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
  }

  const nextTokens = {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken ?? tokens.refreshToken
  };

  await setTokens(nextTokens);
  resetSessionExpiredState();
  if (typeof data.data.onboardingCompleted === 'boolean') {
    setOnboardingCompleted(data.data.onboardingCompleted);
  }

  return nextTokens.accessToken;
};

export const refreshStoredTokens = () => {
  if (!refreshPromise) {
    refreshPromise = performStoredTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  if (shouldUseNativeAuthBridge()) {
    config.adapter = nativeApiAdapter;
    return config;
  }

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
      if (shouldUseNativeAuthBridge()) {
        await expireSession();
        throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
      }

      const accessToken = await refreshStoredTokens();
      if (!accessToken) throw new Error(SESSION_EXPIRED_ERROR_MESSAGE);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);
