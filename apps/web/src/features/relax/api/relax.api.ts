import { apiClient } from '../../../shared/api/client';
import { unwrapApiResponse } from '../../../shared/api/response';
import type { ApiResponse } from '../../../shared/types/api';
import type { RelaxActivity } from '../model/relax.types';

export type { RelaxActivity } from '../model/relax.types';

interface RecommendRequest {
  mood: string;
  time: string;
}

interface CountResponse {
  count: number;
}

interface StartResponse {
  activityId: number;
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

  const recommendations = unwrapApiResponse(data, '휴식을 추천하지 못했습니다.');
  if (recommendations.length === 0) throw new Error('추천할 수 있는 휴식이 없습니다.');

  return recommendations;
};

export const startRelax = async (relaxId: number) => {
  const { data } = await apiClient.post<ApiResponse<StartResponse>>(
    `/api/relaxes/${relaxId}/start`
  );

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
  return unwrapApiResponse(data, '함께 쉬는 인원을 불러오지 못했습니다.').count;
};
