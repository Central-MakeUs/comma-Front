import { apiClient } from '../../../shared/api/client';
import { unwrapApiResponse } from '../../../shared/api/response';
import type { ApiResponse } from '../../../shared/types/api';
import type { QuestionInfo } from '../model/checklist.types';

interface ChecklistResponse {
  questions: QuestionInfo[];
}

export const getChecklists = async () => {
  const { data } = await apiClient.get<ApiResponse<ChecklistResponse>>('/api/checklists');

  return data;
};

export const getChecklistQuestions = async () => {
  const response = await getChecklists();
  const questions = unwrapApiResponse(
    response,
    '체크리스트를 불러오는 중 오류가 발생했습니다.'
  ).questions;

  if (questions.length < 2 || questions.some((question) => (question.options?.length ?? 0) < 2)) {
    throw new Error('체크리스트를 불러오는 중 오류가 발생했습니다.');
  }

  return questions;
};
