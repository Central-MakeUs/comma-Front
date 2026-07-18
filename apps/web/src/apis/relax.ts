import type { ApiResponse } from '../types/api';
import type { RelaxActivity } from '../types/relax';
import { apiClient } from './client';

export type { RelaxActivity } from '../types/relax';

interface RecommendRequest {
  mood: string;
  time: string;
}

interface CountResponse {
  count: number;
}

export const recommend = async ({ mood, time }: RecommendRequest) => {
  const { data } = await apiClient.get<ApiResponse<RelaxActivity[]>>(
    '/api/relaxes/recommendations',
    {
      params: {
        mood,
        time
      }
    }
  );

  return data;
};

export const startRelax = async (relaxId: number) => {
  const { data } = await apiClient.post<ApiResponse>(`/api/relaxes/${relaxId}/start`);

  return data;
};

export const getRelaxActiveCount = async (relaxId: number) => {
  const { data } = await apiClient.get<ApiResponse<CountResponse>>(
    `/api/relaxes/${relaxId}/active-count`
  );

  return data;
};

export interface OnlineResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export const onlineCount = async () => {
  const { data } = await apiClient.get<OnlineResponse>('/api/relaxes/online-count');
  return data;
};
