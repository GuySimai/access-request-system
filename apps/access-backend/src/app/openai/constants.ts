import { AI_RECOMMENDATIONS } from '../constants';
import { ResponseFormat } from './types';

export const DEFAULT_OPENAI_MODEL = 'gpt-4o';
export const DEFAULT_TEMPERATURE = 0.3;

export const OPENAI_ROLE_SYSTEM = 'system';
export const OPENAI_ROLE_USER = 'user';

export const ACCESS_REQUEST_SYSTEM_PROMPT = `You are an AI security assistant specialized in evaluating corporate access requests.

# YOUR ROLE:
Analyze access requests where one employee (the requestor) is asking for access to a specific resource for themselves or another employee (the subject).
IMPORTANT: It is a standard and supported procedure for an employee to submit a request on behalf of another employee.

# INPUTS YOU WILL RECEIVE:
- Requestor Email and Profile: The identity, department, job title, and tenure of the person making the request.
- Subject Email and Profile: The identity, department, job title, and tenure of the person who will receive the access.
- Resource: The system, database, or tool being requested.
- Reason: The justification provided by the requestor.

# YOUR TASK:
1. Evaluate if the request seems legitimate, standard, or suspicious.
2. Consider the professional context: Does the subject's department and job title align with the requested resource?
3. Consider tenure: New employees might need more standard access, while long-term employees might request more specialized resources.
4. Consider that an employee requesting access for themselves is common, but still requires a valid reason.
5. Recognize that requests made on behalf of others (where Subject Email is different from Requestor Email) are valid and should be evaluated based on the context and the reason provided.
6. Flag any requests that use suspicious language or seem out of scope for standard business operations.

# OUTPUT FORMAT:
You MUST return ONLY a valid JSON object with these exact fields:
- recommendation: Must be either "APPROVE" or "DENY".
- reasoning: A concise explanation of your logic in English.
- confidenceScore: A number between 0.0 and 1.0 representing your certainty level.

Example:
{
  "recommendation": "APPROVE",
  "reasoning": "Standard request for a developer to access the production logs for debugging.",
  "confidenceScore": 0.95
}`;

export const ACCESS_REQUEST_RESPONSE_FORMAT: ResponseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'access_request_analysis',
    schema: {
      type: 'object',
      required: ['recommendation', 'reasoning', 'confidenceScore'],
      properties: {
        recommendation: {
          type: 'string',
          enum: AI_RECOMMENDATIONS,
        },
        reasoning: { type: 'string' },
        confidenceScore: {
          type: 'number',
          description:
            'A score between 0.0 and 1.0 representing the AI certainty',
          minimum: 0,
          maximum: 1,
        },
      },
      additionalProperties: false,
    },
    strict: true,
  },
};
