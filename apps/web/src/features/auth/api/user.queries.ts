import { queryOptions } from '@tanstack/react-query';
import { getPlan, getRandomNickname } from './user.api';

export const userQueryKeys = {
  all: ['user'] as const,
  plan: () => [...userQueryKeys.all, 'plan'] as const,
  randomNickname: () => [...userQueryKeys.all, 'nickname', 'random'] as const
};

export const userPlanQueryOptions = queryOptions({
  queryKey: userQueryKeys.plan(),
  queryFn: getPlan
});

export const randomNicknameQueryOptions = queryOptions({
  queryKey: userQueryKeys.randomNickname(),
  queryFn: getRandomNickname,
  staleTime: Number.POSITIVE_INFINITY
});
