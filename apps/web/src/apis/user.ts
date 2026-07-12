import type { ApiResponse } from '../types/api';
import { apiClient } from './client';

export interface NicknameRequest {
  nickname: string;
}

export interface NicknameData {
  nickname: string;
}

export type NicknameResponse = ApiResponse<NicknameData>;

export const getRandomNickname = async () => {
  const { data } = await apiClient.get<NicknameResponse>('/api/users/nickname/random');

  return data;
};

export const updateNickname = async ({ nickname }: NicknameRequest) => {
  const { data } = await apiClient.patch<NicknameResponse>('/api/users/nickname', { nickname });

  return data;
};
