import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { getChecklistQuestions } from './checklist.api';
import { checklistQueryKey, checklistQueryOptions } from './checklist.queries';

vi.mock('./checklist.api', () => ({
  getChecklistQuestions: vi.fn()
}));

describe('checklistQueryOptions', () => {
  it('uses the shared checklist cache key and query function', async () => {
    vi.mocked(getChecklistQuestions).mockResolvedValue([]);
    const queryFn = checklistQueryOptions.queryFn;
    if (!queryFn) throw new Error('Checklist query function is missing.');

    await queryFn({
      client: new QueryClient(),
      queryKey: checklistQueryOptions.queryKey,
      signal: new AbortController().signal,
      meta: undefined
    });

    expect(checklistQueryOptions.queryKey).toEqual(checklistQueryKey);
    expect(getChecklistQuestions).toHaveBeenCalledOnce();
  });
});
