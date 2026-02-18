import { createContext, useContext } from 'react';
import type { User } from './authStorage';

export const UserContext = createContext<User | null>(null);

export function useCurrentUser(): User | null {
  return useContext(UserContext);
}

export function useIsAdmin(): boolean {
  const user = useContext(UserContext);
  return user?.role === 'admin';
}
