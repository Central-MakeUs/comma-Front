import type { FeedCreateRequest, FeedResponse } from '@comma/bridge';
import type { ApiResponse } from '../types/api';
import { apiClient } from './client';

export type { FeedCreateRequest, FeedResponse } from '@comma/bridge';

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
