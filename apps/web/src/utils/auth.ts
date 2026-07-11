import { publicApiClient } from './apiClient';

export type fieldType = 'KAKAO' | 'GOOGLE' | 'APPLE';

export interface LoginRequest {
  field: fieldType;
  code: string;
  redirectUri: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    onboardingCompleted: boolean;
  };
  [key: string]: unknown;
}

export const login = async ({ field, code, redirectUri }: LoginRequest) => {
  const { data } = await publicApiClient.post<LoginResponse>(`/api/auth/login/${field}`, {
    code,
    redirectUri
  });

  return data;
};
