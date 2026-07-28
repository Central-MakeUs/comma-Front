import type { ApiResponse } from '../types/api';
import { apiClient, publicApiClient, refreshStoredTokens } from './client';

export type fieldType = 'KAKAO' | 'GOOGLE' | 'APPLE';

export interface LoginRequest {
  field: fieldType;
  code: string;
  redirectUri: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  onboardingCompleted: boolean;
  nickname: string;
}

export type LoginResponse = ApiResponse<TokenResponse>;
export type LogoutResponse = ApiResponse<void>;

export const login = async ({ field, code, redirectUri }: LoginRequest) => {
  const { data } = await publicApiClient.post<LoginResponse>(`/api/auth/login/${field}`, {
    code,
    redirectUri
  });

  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post<LogoutResponse>('/api/auth/logout');

  return data;
};

export const refreshToken = refreshStoredTokens;
