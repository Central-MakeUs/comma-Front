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

export const checklistQueryKey = ['checklists'] as const;

export const getChecklistQuestions = async () => {
  const response = await getChecklists();
  const questions = response.data?.questions;

  if (
    !response.success ||
    !questions ||
    questions.length < 2 ||
    questions.some((question) => (question.options?.length ?? 0) < 2)
  ) {
    throw new Error(response.message ?? '체크리스트를 불러오는 중 오류가 발생했습니다.');
  }

  return questions;
};
