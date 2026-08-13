import { queryOptions } from '@tanstack/react-query';
import { getPlan, getRandomNickname, getRestStatus } from './user.api';

export const userQueryKeys = {
  all: ['user'] as const,
  plan: () => [...userQueryKeys.all, 'plan'] as const,
  restStatus: () => [...userQueryKeys.all, 'rest-status'] as const,
  randomNickname: () => [...userQueryKeys.all, 'nickname', 'random'] as const
};

export const userPlanQueryOptions = queryOptions({
  queryKey: userQueryKeys.plan(),
  queryFn: getPlan
});

export const userRestStatusQueryOptions = queryOptions({
  queryKey: userQueryKeys.restStatus(),
  queryFn: getRestStatus
});

export const randomNicknameQueryOptions = queryOptions({
  queryKey: userQueryKeys.randomNickname(),
  queryFn: getRandomNickname,
  staleTime: Number.POSITIVE_INFINITY
});
