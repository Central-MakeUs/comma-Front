import { queryOptions } from '@tanstack/react-query';
import { getMyReport } from './mypage.api';

export const myReportQueryKey = ['mypage', 'report'] as const;

export const myReportQueryOptions = queryOptions({
  queryKey: myReportQueryKey,
  queryFn: getMyReport,
  staleTime: 1000 * 60 * 5
});
