export interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
}

export type loadingState = 'loading' | 'empty' | 'error' | 'success';