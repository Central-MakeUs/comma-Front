import { useMutation } from '@tanstack/react-query';
import { startRelaxActivity } from '../api/relax.mutations';

export const useStartRelax = () => useMutation({ mutationFn: startRelaxActivity });
