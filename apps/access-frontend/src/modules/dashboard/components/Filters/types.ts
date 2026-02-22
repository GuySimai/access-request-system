import { RequestStatus } from '../../../../types/access-request';

export interface FiltersProps {
  status?: RequestStatus;
  setStatus: (status?: RequestStatus) => void;
  requestorEmail: string;
  setRequestorEmail: (email: string) => void;
  subjectEmail: string;
  setSubjectEmail: (email: string) => void;
  onApply: () => void;
  onClear: () => void;
  isLoading?: boolean;
}
