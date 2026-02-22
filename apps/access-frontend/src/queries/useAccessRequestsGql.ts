import { useQuery } from '@tanstack/react-query';
import { GraphQLClient, gql } from 'graphql-request';
import { AccessRequest } from '../types/access-request';

const GET_ACCESS_REQUESTS = gql`
  query GetAccessRequests(
    $requestorEmail: String
    $subjectEmail: String
    $status: RequestStatus
    $skip: Float
    $take: Float
  ) {
    accessRequests(
      requestorEmail: $requestorEmail
      subjectEmail: $subjectEmail
      status: $status
      skip: $skip
      take: $take
    ) {
      id
      resource
      reason
      status
      createdAt
      requestor {
        id
        name
        email
      }
      subject {
        id
        name
        email
      }
      approver {
        id
        name
        email
      }
      decisionAt
      aiEvaluation {
        recommendation
        reasoning
        confidenceScore
      }
    }
  }
`;

interface GqlAccessRequest extends Omit<AccessRequest, 'decidedBy'> {
  approver?: AccessRequest['decidedBy'];
}

export const useAccessRequestsGql = (
  filters: {
    status?: AccessRequest['status'];
    requestorEmail?: string;
    subjectEmail?: string;
    skip?: number;
    take?: number;
  } = {}
) => {
  const endpoint = import.meta.env.VITE_GQL_URL;

  const client = new GraphQLClient(endpoint, {
    fetch,
    // This ensures cookies are sent with the request
    credentials: 'include',
  });

  return useQuery({
    queryKey: ['access-requests', 'gql', filters],
    queryFn: async () => {
      const response = await client.request<{
        accessRequests: GqlAccessRequest[];
      }>(GET_ACCESS_REQUESTS, filters);

      return response.accessRequests.map((req) => ({
        ...req,
        decidedBy: req.approver,
      })) as AccessRequest[];
    },
  });
};
