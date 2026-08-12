import { describe, expect, it } from 'vitest';
import type { ApiResponse } from '../types/api';
import { ApiError, unwrapApiResponse } from './response';

describe('unwrapApiResponse', () => {
  it.each([
    ['false', false],
    ['zero', 0],
    ['empty string', '']
  ])('returns a valid %s payload', (_, data) => {
    const response: ApiResponse<typeof data> = { success: true, data };

    expect(unwrapApiResponse(response, 'fallback')).toBe(data);
  });

  it('throws the server message when the request failed', () => {
    const response: ApiResponse = {
      success: false,
      message: '인증이 만료되었습니다.'
    };

    expect(() => unwrapApiResponse(response, 'fallback')).toThrow(
      new ApiError('인증이 만료되었습니다.')
    );
  });

  it('throws the fallback message when a successful response has no data', () => {
    const response: ApiResponse = { success: true };

    expect(() => unwrapApiResponse(response, '응답 데이터가 없습니다.')).toThrow(
      '응답 데이터가 없습니다.'
    );
  });
});
