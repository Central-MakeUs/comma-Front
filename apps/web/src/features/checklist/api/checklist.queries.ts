import { queryOptions } from '@tanstack/react-query';
import { getChecklistQuestions } from './checklist.api';

export const checklistQueryKey = ['checklists'] as const;

export const checklistQueryOptions = queryOptions({
  queryKey: checklistQueryKey,
  queryFn: getChecklistQuestions,
  staleTime: 1000 * 60 * 10
});
