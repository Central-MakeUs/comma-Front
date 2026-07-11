import { apiClient } from './apiClient';

export type fieldType = 'KAKAO' | 'GOOGLE' | 'APPLE';

export interface LoginRequest {
  field: fieldType;
  code: string;
  redirectUri: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export const login = async ({ field, code, redirectUri }: LoginRequest) => {
  const { data } = await apiClient.post<LoginResponse>(`/api/auth/login/${field}`, {
    code,
    redirectUri
  });

  return data;
};
