import { ChatMessage } from './types';
import { AI_RECOMMENDATIONS } from '../constants';
import { AiRecommendation } from './types';
import { EmployeeMetadata } from '@prisma/client';

export const getAccessRequestUserPrompt = (
  requestorEmail: string,
  subjectEmail: string,
  resource: string,
  reason: string,
  requestorMetadata?: EmployeeMetadata,
  subjectMetadata?: EmployeeMetadata
): string => {
  const requestorInfo = requestorMetadata
    ? `(Dept: ${requestorMetadata.department}, Title: ${requestorMetadata.jobTitle}, Tenure: ${requestorMetadata.tenureMonths} months)`
    : '';
  const subjectInfo = subjectMetadata
    ? `(Dept: ${subjectMetadata.department}, Title: ${subjectMetadata.jobTitle}, Tenure: ${subjectMetadata.tenureMonths} months)`
    : '';

  return `
Access Request Analysis:
- The employee "${requestorEmail}" ${requestorInfo} is requesting access for the employee "${subjectEmail}" ${subjectInfo}.
- The access is requested for the following resource: "${resource}"
- The justification provided for this request is: "${reason}"

Please evaluate if this request is standard or suspicious based on the employees' departments, job titles, and tenure.
`.trim();
};

export const getAccessRequestMessages = (
  systemPrompt: string,
  userPrompt: string,
  systemRole: ChatMessage['role'],
  userRole: ChatMessage['role']
): ChatMessage[] => {
  return [
    {
      role: systemRole,
      content: systemPrompt,
    } as ChatMessage,
    {
      role: userRole,
      content: userPrompt,
    } as ChatMessage,
  ];
};

export const isValidAiRecommendation = (
  result: unknown
): result is AiRecommendation => {
  if (!result || typeof result !== 'object') {
    return false;
  }

  const candidate = result as Record<string, unknown>;

  return (
    typeof candidate.recommendation === 'string' &&
    AI_RECOMMENDATIONS.includes(candidate.recommendation) &&
    typeof candidate.reasoning === 'string' &&
    typeof candidate.confidenceScore === 'number'
  );
};
