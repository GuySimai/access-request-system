import { REQUEST_STATUS } from '../../../../constants/access-request';
import type { AccessRequest, UserRole } from '../../../../types/access-request';

export interface RequestsTableProps {
  requests: AccessRequest[] | undefined;
  isLoading: boolean;
  userRole: UserRole | undefined;
  onDecision: (
    id: string,
    status: typeof REQUEST_STATUS.APPROVED | typeof REQUEST_STATUS.DENIED
  ) => void;
  page: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasNextPage: boolean;
}
