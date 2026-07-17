import { apiClient } from './client';
import type { ApiResponse } from '../types/api';
import { questionInfo } from '../types/checklist';

interface checklistResponse {
    questions: questionInfo[]
}

export const getChecklists = async () => {
    const { data } = await apiClient.get<ApiResponse<checklistResponse>>('/api/checklists');
    console.log(data);
    return data;
}