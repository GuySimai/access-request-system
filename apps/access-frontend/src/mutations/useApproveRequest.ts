import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '@sdk/access';
import { useToast, TOAST_TYPES } from '../providers/ToastProvider';
import { REQUEST_STATUS } from '../constants/access-request';

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  const { raise } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: typeof REQUEST_STATUS.APPROVED | typeof REQUEST_STATUS.DENIED;
    }) => {
      await sdk.HandleAccessRequestDecision({ id }, { status });
    },
    onSuccess: (_, variables) => {
      const action =
        variables.status === REQUEST_STATUS.APPROVED ? 'approved' : 'denied';
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
