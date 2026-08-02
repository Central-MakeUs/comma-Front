import type { ApiResponse } from '../types/api';
import { apiClient } from './client';

export interface ActivityRank {
  rank: number;
  relaxId: number;
  name: string;
  count: number;
}

export type Mood = 'A' | 'B' | 'C';

export interface MoodRatio {
  mood: Mood;
  label: string;
  count: number;
  ratio: number;
}

export type TimeBudget = 'X' | 'Y' | 'Z';

export interface TimeBudgetRatio {
  timeBudget: TimeBudget;
  label: string;
  count: number;
  ratio: number;
}

export interface MyReport {
  activityRanking: ActivityRank[];
  moodRatio: MoodRatio[];
  timeBudgetRatio: TimeBudgetRatio[];
}

export type MyReportResponse = ApiResponse<MyReport>;

export const myReportQueryKey = ['mypage', 'report'] as const;

export const getMyReport = async () => {
  const { data } = await apiClient.get<MyReportResponse>('/api/mypage/report');

  return data;
};
