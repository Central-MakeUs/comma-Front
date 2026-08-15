import type { ApiResponse } from '../../../shared/types/api';

export type AuthProvider = 'KAKAO' | 'GOOGLE' | 'APPLE';

export interface LoginRequest {
  field: AuthProvider;
  code: string;
  redirectUri: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  onboardingCompleted: boolean;
  nickname: string | null;
}

export interface LoginData {
  onboardingCompleted: boolean;
  nickname: string | null;
}

export type TokenLoginResponse = ApiResponse<TokenResponse>;
export type LoginResponse = ApiResponse<LoginData>;
export type LogoutResponse = ApiResponse<void>;
