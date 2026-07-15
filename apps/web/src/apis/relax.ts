import { apiClient } from './client';

export type moodType = 'A' | 'B' | 'C';
export type timeType = 'X' | 'Y' | 'Z';

export interface recommendRequest {
  mood: moodType;
  time: timeType;
}

export interface RelaxActivity {
  id: number;
  name: string;
  description: string;
  activeMessage: string;
  imageUrl: string | null;
  activeUserCount: number;
}

export interface recommendResponse {
  success: boolean;
  message: string;
  data: RelaxActivity[];
}

export const recommend = async ({ mood, time }: recommendRequest) => {
  const { data } = await apiClient.get<recommendResponse>('/api/relaxes/recommendations', {
    params: {
      mood,
      time
    }
  });

  return data;
};

export interface onlineResponse {
  success: boolean,
  message: string,
  data: {
    count: number,
  }
}

export const onlineCount = async () => {
  const { data } = await apiClient.get<onlineResponse>('/api/relaxes/online-count');
  return data;
}