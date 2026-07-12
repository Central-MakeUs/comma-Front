export { apiClient, authApiClient, publicApiClient } from '../apis/client';

export const relaxApiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/relaxes`
})