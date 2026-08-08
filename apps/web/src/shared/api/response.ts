import type { ApiResponse } from '../types/api';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const unwrapApiResponse = <TData>(
  response: ApiResponse<TData>,
  fallbackMessage: string
): TData => {
  if (!response.success || response.data == null) {
    throw new ApiError(response.message ?? fallbackMessage);
  }

  return response.data;
};
