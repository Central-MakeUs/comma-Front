import { apiClient } from '../../../shared/api/client';
import { unwrapApiResponse } from '../../../shared/api/response';
import type { MyReportResponse } from '../model/mypage.types';

export const getMyReport = async () => {
  const { data } = await apiClient.get<MyReportResponse>('/api/mypage/report');

  return unwrapApiResponse(data, '마이페이지 리포트를 불러오지 못했습니다.');
};
