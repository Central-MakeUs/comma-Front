import { apiClient } from '../../../shared/api/client';
import { unwrapApiResponse } from '../../../shared/api/response';
import type { ApiResponse } from '../../../shared/types/api';

export interface NicknameRequest {
  nickname: string;
}

export interface NicknameData {
  nickname: string;
}

export type NicknameResponse = ApiResponse<NicknameData>;

export type UserPlan = 'FREE' | 'PREMIUM';
export type PremiumAlertContactType = 'EMAIL' | 'PHONE';

export interface PlanCard {
  plan: UserPlan;
  label: string;
  description: string;
  selected: boolean;
}

export interface PlanData {
  currentPlan: UserPlan;
  plans: PlanCard[];
}

export interface PlanRequest {
  plan: UserPlan;
}

export interface PremiumAlertRequest {
  contactType: PremiumAlertContactType;
  contact: string;
}

export interface RestStatusData {
  restedToday: boolean;
  lastRestedAt?: string | null;
}

export type PlanResponse = ApiResponse<PlanData>;
export type RestStatusResponse = ApiResponse<RestStatusData>;
export type VoidResponse = ApiResponse<void>;

export const getRandomNickname = async () => {
  const { data } = await apiClient.get<NicknameResponse>('/api/users/nickname/random');

  return unwrapApiResponse(data, '추천 닉네임을 불러오지 못했습니다.');
};

export const updateNickname = async ({ nickname }: NicknameRequest) => {
  const { data } = await apiClient.patch<NicknameResponse>('/api/users/nickname', { nickname });

  return unwrapApiResponse(data, '닉네임을 저장하지 못했습니다.');
};

export const getPlan = async () => {
  const { data } = await apiClient.get<PlanResponse>('/api/users/me/plan');

  return unwrapApiResponse(data, '플랜 정보를 불러오지 못했습니다.');
};

export const getRestStatus = async () => {
  const { data } = await apiClient.get<RestStatusResponse>('/api/users/me/rest-status');

  return unwrapApiResponse(data, '휴식 상태를 불러오지 못했습니다.');
};

export const changePlan = async ({ plan }: PlanRequest) => {
  const { data } = await apiClient.patch<PlanResponse>('/api/users/me/plan', { plan });

  return data;
};

export const requestPremiumAlert = async ({ contactType, contact }: PremiumAlertRequest) => {
  const { data } = await apiClient.post<VoidResponse>('/api/users/me/premium-alert', {
    contactType,
    contact
  });

  return data;
};

export const withdrawUser = async () => {
  const { data } = await apiClient.delete<VoidResponse>('/api/users/me');

  return data;
};
