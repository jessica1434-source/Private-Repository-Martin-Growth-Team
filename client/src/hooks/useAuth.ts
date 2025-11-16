import { useQuery } from "@tanstack/react-query";

export interface AuthManager {
  id: string;
  username: string;
  name: string;
  role: 'boss' | 'supervisor' | 'manager';
}

export function useAuth() {
  const { data: manager, isLoading, error, refetch } = useQuery<AuthManager>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    manager,
    isLoading,
    isAuthenticated: !!manager && !error,
    refetch,
  };
}
