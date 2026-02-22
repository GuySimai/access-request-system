import { useMutation } from '@tanstack/react-query';
import { sdk } from '@sdk/access';
import { useAuth, type User } from '../providers/AuthProvider';

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await sdk.Login(null, credentials);
      return data;
    },
    onSuccess: (data) => {
      login(data.user as User);
    },
  });
};
