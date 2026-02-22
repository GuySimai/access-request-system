import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '@sdk/access';
import { useToast, TOAST_TYPES } from '../providers/ToastProvider';

export const useCreateAccessRequest = () => {
  const queryClient = useQueryClient();
  const { raise } = useToast();

  return useMutation({
    mutationFn: async (dto: {
      subjectEmail: string;
      resource: string;
      reason: string;
    }) => {
      await sdk.CreateAccessRequest(null, dto);
    },
    onSuccess: () => {
      raise('Access request sent successfully', TOAST_TYPES.POSITIVE);
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      raise(
        error.response?.data?.message || 'Failed to send access request',
        TOAST_TYPES.NEGATIVE
      );
    },
  });
};
