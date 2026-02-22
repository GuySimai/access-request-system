import { REQUEST_STATUS } from '../../../../constants/access-request';

export const STATUS_OPTIONS = [
  { value: REQUEST_STATUS.PENDING, label: 'Pending' },
  { value: REQUEST_STATUS.APPROVED, label: 'Approved' },
  { value: REQUEST_STATUS.DENIED, label: 'Denied' },
];
