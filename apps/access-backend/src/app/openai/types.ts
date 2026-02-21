import OpenAI from 'openai';
import {
  AI_RECOMMENDATION_APPROVE,
  AI_RECOMMENDATION_DENY,
} from '../constants';

export type ChatMessage = OpenAI.Chat.ChatCompletionMessageParam;
export type ResponseFormat =
  OpenAI.Chat.ChatCompletionCreateParams['response_format'];

export interface AiRecommendation {
  recommendation:
    | typeof AI_RECOMMENDATION_APPROVE
    | typeof AI_RECOMMENDATION_DENY;
  reasoning: string;
  confidenceScore: number;
}
