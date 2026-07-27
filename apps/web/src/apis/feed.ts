import type { ApiResponse } from '../types/api';
import { apiClient } from './client';

interface feedRequest {
  mood?: string;
  timeBudget?: string;
  cursor?: number;
  size?: number;
}

interface feedResponse {
  items: Array<
      {
        feedId: number;
        mood: string;
        timeBudget: string;
        imageUrl: string;
        hashtags: string[];
        review: string;
        isPublic: boolean;
        createdAt: string;
        likeCount: number;
        isLiked: boolean;
      }
    >;
  nextCursor: number;
  hasNext: boolean;
}

export const getFeeds = async ({ mood, timeBudget, cursor, size }: feedRequest) => {
  const { data } = await apiClient.get<ApiResponse<feedResponse>>(`/api/feeds`, {
    params: {
      mood,
      timeBudget,
      cursor,
      size
    }
  });

  return data;
};

interface myRequest {
  cursor?: number;
  size?: number;
}

export const getMyFeeds = async ({ cursor, size }: myRequest) => {
  const { data } = await apiClient.get<ApiResponse<feedResponse>>(`/api/feeds/me`, {
    params: {
      cursor,
      size
    }
  });

  return data;
};

interface likeRequest {
  feedId: number;
}

interface likeResponse {
  liked: boolean;
  likeCount: number;
}

export const getLikes = async ({ feedId }: likeRequest) => {
  const { data } = await apiClient.post<ApiResponse<likeResponse>>(`/api/feeds/${feedId}/likes`);

  return data;
};
