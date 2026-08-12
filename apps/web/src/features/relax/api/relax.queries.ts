import { queryOptions } from '@tanstack/react-query';
import { onlineCount } from './relax.api';

export const relaxQueryKeys = {
  all: ['relax'] as const,
  onlineCount: () => [...relaxQueryKeys.all, 'online-count'] as const
};

export const onlineCountQueryOptions = queryOptions({
  queryKey: relaxQueryKeys.onlineCount(),
  queryFn: onlineCount,
  staleTime: 1000 * 30
});
