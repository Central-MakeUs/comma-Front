import type { FeedCreateRequest, FeedResponse } from '@comma/bridge';
import type { ApiResponse } from '../types/api';
import { apiClient } from './client';

export type { FeedCreateRequest, FeedResponse } from '@comma/bridge';

interface feedRequest {
  mood?: string;
  timeBudget?: string;
  cursor?: number;
  size?: number;
}

interface feedResponse {
  items: Array<{
    feedId: number;
    nickname?: string;
    mood: string;
    timeBudget: string;
    imageUrl: string;
    hashtags: string[];
    review: string;
    isPublic: boolean;
    createdAt: string;
    likeCount: number;
    isLiked: boolean;
  }>;
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

export async function createFeed(image: File, request: FeedCreateRequest) {
  const formData = new FormData();

  formData.append('image', image);
  formData.append(
    'request',
    new Blob([JSON.stringify(request)], {
      type: 'application/json'
    })
  );

  const { data } = await apiClient.post<ApiResponse<FeedResponse>>('/api/feeds', formData);

  return data;
}

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

export const postLikes = async ({ feedId }: likeRequest) => {
  const { data } = await apiClient.post<ApiResponse<likeResponse>>(`/api/feeds/${feedId}/likes`);

  return data;
};

interface reportRequest {
  feedId: string
}

interface reportResponse {
  success: boolean,
  message: string,
  data: string,
}

export const reportFeed = async ({feedId}: reportRequest) => {
  const { data } = await apiClient.post<ApiResponse<reportResponse>>(`/api/feeds/${feedId}/report`);

  return data;
}

interface blockRequest {
  feedId: string
}

interface blockResponse {
  success: boolean,
  message: string,
  data: {
    blocked: boolean,
  }
}

export const blockFeed = async ({feedId}: blockRequest) => {
  const { data } = await apiClient.post<ApiResponse<blockResponse>>(`/api/feeds/${feedId}/block`);

  return data;
}
