import type { ApiResponse } from '../types/api';
import type { questionInfo } from '../types/checklist';
import { apiClient } from './client';

interface checklistResponse {
  questions: questionInfo[];
}

export const getChecklists = async () => {
  const { data } = await apiClient.get<ApiResponse<checklistResponse>>('/api/checklists');

  return data;
};
