import type { ApiResponse } from '../types/api';
import type { MoodType, RelaxActivity, TimeType } from '../types/relax';
import { apiClient } from './client';

export type { RelaxActivity } from '../types/relax';

interface RecommendRequest {
  mood: MoodType;
  time: TimeType;
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
