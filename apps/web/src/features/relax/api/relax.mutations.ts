import type { RelaxActivity } from '../model/relax.types';
import { getRelaxActiveCount, startRelax } from './relax.api';

export const startRelaxActivity = async (relax: RelaxActivity) => {
  const startResponse = await startRelax(relax.id);
  const activityId = startResponse.data?.activityId;

  if (!startResponse.success || typeof activityId !== 'number') {
    throw new Error(startResponse.message ?? '휴식을 시작하지 못했어요.');
  }

  const startedRelax = { ...relax, activityId };

  try {
    const countResponse = await getRelaxActiveCount(relax.id);
    if (countResponse.success && typeof countResponse.data?.count === 'number') {
      return { ...startedRelax, activeUserCount: countResponse.data.count };
    }
  } catch (error) {
    console.error('Failed to load active count.', error);
  }

  return startedRelax;
};
