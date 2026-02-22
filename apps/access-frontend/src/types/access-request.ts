import { REQUEST_STATUS, USER_ROLE } from '../constants/access-request';

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface UserMetadata {
  id: string;
  name: string;
  email: string;
}

export interface AiEvaluation {
  score: number;
  summary: string;
}

export interface AccessRequest {
  id: string;
  status: RequestStatus;
  createdAt: string;
  requestor: UserMetadata;
  subject: UserMetadata;
  resource: string;
  reason: string;
  decidedBy?: UserMetadata;
  decisionAt?: string;
  aiEvaluation?: AiEvaluation;
}
