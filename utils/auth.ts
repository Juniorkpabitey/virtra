import { getToken, removeToken } from '@/utils/storage';

export const isAuthenticated = (): boolean => {
  const token: string | null = getToken();
  return !!token; // true if token exists
};

export const logoutUser = (): void => {
  removeToken();
  window.location.href = '/login'; // hard redirect to prevent cached state
};
