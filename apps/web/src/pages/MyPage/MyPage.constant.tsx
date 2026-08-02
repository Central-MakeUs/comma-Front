import type { ActivityRank, MoodRatio, TimeBudgetRatio } from '../../apis/mypage';

export const fallbackActivityRanking: ActivityRank[] = [
  { rank: 1, relaxId: 1, name: '가볍게 산책하기', count: 13 },
  { rank: 2, relaxId: 2, name: '가볍게 산책하기', count: 5 },
  { rank: 3, relaxId: 3, name: '가볍게 산책하기', count: 4 },
  { rank: 4, relaxId: 4, name: '가볍게 산책하기', count: 3 },
  { rank: 5, relaxId: 5, name: '가볍게 산책하기', count: 2 }
];

export const fallbackMoodRatio: MoodRatio[] = [
  { mood: 'A', label: '멍하고 싶어', count: 55, ratio: 55 },
  { mood: 'B', label: '기분 전환이 필요해', count: 35, ratio: 35 },
  { mood: 'C', label: '가볍게 해볼 수 있어', count: 10, ratio: 10 }
];

export const fallbackTimeBudgetRatio: TimeBudgetRatio[] = [
  { timeBudget: 'X', label: '잠깐(1시간 이내)', count: 70, ratio: 70 },
  { timeBudget: 'Y', label: '여유(1-6시간이내)', count: 25, ratio: 25 },
  { timeBudget: 'Z', label: '넉넉(6시간이상)', count: 5, ratio: 5 }
];
