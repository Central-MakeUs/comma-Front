import {
  apiClient,
  publicApiClient,
  refreshStoredTokens,
  resetSessionExpiredState
} from '../../../shared/api/client';
import { appBridge } from '../../../shared/bridge/bridge';
import {
  setOnboardingCompleted,
  setStoredNickname,
  setTokens
} from '../../../shared/lib/tokenStorage';
import type {
  AuthProvider,
  LoginData,
  LoginRequest,
  LogoutResponse,
  TokenLoginResponse
} from '../model/auth.types';

export type { AuthProvider, LoginData, LoginRequest, LoginResponse } from '../model/auth.types';

const persistLoginData = (data: LoginData) => {
  setOnboardingCompleted(data.onboardingCompleted);
  setStoredNickname(data.nickname);
};

export const login = async ({ field, code, redirectUri }: LoginRequest) => {
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

  const loginData = {
    onboardingCompleted: data.data.onboardingCompleted,
    nickname: data.data.nickname
  };
  persistLoginData(loginData);

  return {
    success: true,
    message: data.message,
    data: loginData
  };
};

export const loginWithNativeProvider = async (provider: AuthProvider) => {
  const result = await appBridge.loginWithProvider(provider);
  if (result.success) {
    if (result.data) persistLoginData(result.data);
    resetSessionExpiredState();
  }
  return result;
};

export const logout = async () => {
  const { data } = await apiClient.post<LogoutResponse>('/api/auth/logout');

  return data;
};

export const refreshToken = refreshStoredTokens;
