import { useQuery } from '@tanstack/react-query';
import { sdk } from '@sdk/access';
import { AccessRequest, UserMetadata } from '../types/access-request';

interface RawAccessRequest {
  id: string;
  status: AccessRequest['status'];
  createdAt: string;
  resource: string;
  reason: string;
  requestor: UserMetadata;
  subject: UserMetadata;
  approver?: UserMetadata;
  aiEvaluation?: {
    confidenceScore: number;
    reasoning: string;
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
            aiEvaluation: request.aiEvaluation
              ? {
                  score: request.aiEvaluation.confidenceScore,
                  summary: request.aiEvaluation.reasoning,
                }
              : undefined,
          } as AccessRequest)
      );
    },
  });
};
