import { useQuery } from '@tanstack/react-query';
import { sdk } from '@sdk/access';
import { AccessRequest, UserMetadata } from '../types/access-request';

interface RawAccessRequest
  extends Omit<AccessRequest, 'decidedBy' | 'aiEvaluation'> {
  approver?: UserMetadata;
  aiEvaluation?: {
    recommendation: string;
    reasoning: string;
    confidenceScore: number;
  };
}

export const useAccessRequests = (
  filters: {
    status?: AccessRequest['status'];
    requestorEmail?: string;
    subjectEmail?: string;
    skip?: number;
    take?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ['access-requests', filters],
    queryFn: async () => {
      const { data } = await sdk.GetAccessRequests(filters);

      // Map backend fields to frontend interface
      return (data as unknown as RawAccessRequest[]).map(
        (request) =>
          ({
            ...request,
            decidedBy: request.approver,
          } as AccessRequest)
      );
    },
  });
};
