import type { FeedCreateRequest, FeedResponse } from '@comma/bridge';
import { apiClient } from '../../../shared/api/client';
import { unwrapApiResponse } from '../../../shared/api/response';
import type { ApiResponse } from '../../../shared/types/api';
import type { FeedPage } from '../model/feed.types';

export type { FeedCreateRequest, FeedResponse } from '@comma/bridge';

export interface FeedQueryRequest {
  mood?: string;
  timeBudget?: string;
  cursor?: number;
  size?: number;
}

export const getFeeds = async ({ mood, timeBudget, cursor, size }: FeedQueryRequest) => {
  const { data } = await apiClient.get<ApiResponse<FeedPage>>(`/api/feeds`, {
    params: {
      mood,
      timeBudget,
      cursor,
      size
    }
  });

  return unwrapApiResponse(data, '피드를 불러오지 못했습니다.');
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

export interface MyFeedsRequest {
  cursor?: number;
  size?: number;
}

export const getMyFeeds = async ({ cursor, size }: MyFeedsRequest) => {
  const { data } = await apiClient.get<ApiResponse<FeedPage>>(`/api/feeds/me`, {
    params: {
      cursor,
      size
    }
  });

  return unwrapApiResponse(data, '내 쉼표를 불러오지 못했습니다.');
};

interface LikeRequest {
  feedId: number;
}

interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

export const postLikes = async ({ feedId }: LikeRequest) => {
  const { data } = await apiClient.post<ApiResponse<LikeResponse>>(`/api/feeds/${feedId}/likes`);

  return data;
};

interface ReportRequest {
  feedId: number;
}

interface ReportResponse {
  success: boolean;
  message: string;
  data: string;
}

export const reportFeed = async ({ feedId }: ReportRequest) => {
  const { data } = await apiClient.post<ApiResponse<ReportResponse>>(`/api/feeds/${feedId}/report`);

  return data;
};

interface BlockRequest {
  feedId: number;
}

interface BlockResponse {
  success: boolean;
  message: string;
  data: {
    blocked: boolean;
  };
}

export const blockFeed = async ({ feedId }: BlockRequest) => {
  const { data } = await apiClient.post<ApiResponse<BlockResponse>>(`/api/feeds/${feedId}/block`);

  return data;
};
