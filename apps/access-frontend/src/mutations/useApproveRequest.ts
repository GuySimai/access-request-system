import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '@sdk/access';
import { useToast, TOAST_TYPES } from '../providers/ToastProvider';

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  const { raise } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'APPROVED' | 'DENIED';
    }) => {
      await sdk.HandleAccessRequestDecision({ id }, { status });
    },
    onSuccess: (_, variables) => {
      const action = variables.status === 'APPROVED' ? 'approved' : 'denied';
      raise(`Request successfully ${action}`, TOAST_TYPES.POSITIVE);
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      raise(
        error.response?.data?.message || 'Failed to update request',
        TOAST_TYPES.NEGATIVE
      );
    },
  });
};
