import { appBridge } from '../bridge';
import type { ApiResponse } from '../types/api';
import { isNativeApp, setTokens } from '../utils/tokenStorage';
import {
  apiClient,
  publicApiClient,
  refreshStoredTokens,
  resetSessionExpiredState
} from './client';

export type fieldType = 'KAKAO' | 'GOOGLE' | 'APPLE';

export interface LoginRequest {
  field: fieldType;
  code: string;
  redirectUri: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  onboardingCompleted: boolean;
  nickname: string;
}

export interface LoginData {
  onboardingCompleted: boolean;
  nickname: string;
}

type TokenLoginResponse = ApiResponse<TokenResponse>;
export type LoginResponse = ApiResponse<LoginData>;
export type LogoutResponse = ApiResponse<void>;

export const login = async ({ field, code, redirectUri }: LoginRequest) => {
  if (isNativeApp()) {
    const result = await appBridge.completeLogin({ field, code, redirectUri });
    if (result.success) resetSessionExpiredState();
    return result;
  }

  const { data } = await publicApiClient.post<TokenLoginResponse>(`/api/auth/login/${field}`, {
    code,
    redirectUri
  });

  if (!data.success || !data.data) {
    return { success: data.success, message: data.message };
  }

  await setTokens({
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken
  });
  resetSessionExpiredState();

  return {
    success: true,
    message: data.message,
    data: {
      onboardingCompleted: data.data.onboardingCompleted,
      nickname: data.data.nickname
    }
  };
};

export const logout = async () => {
  const { data } = await apiClient.post<LogoutResponse>('/api/auth/logout');

  return data;
};

export const refreshToken = refreshStoredTokens;
