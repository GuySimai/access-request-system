import { Label } from '@vibe/core';
import { REQUEST_STATUS } from '../../../../constants/access-request';
import type { RequestStatus } from '../../../../types/access-request';

export const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case REQUEST_STATUS.APPROVED:
      return Label.colors.POSITIVE;
    case REQUEST_STATUS.DENIED:
      return Label.colors.NEGATIVE;
    default:
      return Label.colors.DARK;
  }
};

export const getConfidenceColor = (score: number) => {
  if (score >= 0.7) return Label.colors.POSITIVE;
  if (score >= 0.4) return Label.colors.DARK;
  return Label.colors.NEGATIVE;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
