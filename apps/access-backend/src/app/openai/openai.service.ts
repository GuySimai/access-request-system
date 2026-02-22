import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { AiRecommendation, ChatMessage, ResponseFormat } from './types';
import { PrismaService } from '../db/prisma.service';
import { EmployeeMetadata } from '@access/prisma';
import {
  ACCESS_REQUEST_RESPONSE_FORMAT,
  ACCESS_REQUEST_SYSTEM_PROMPT,
  AI_RECOMMENDATION_APPROVE,
  AI_RECOMMENDATION_DENY,
  DEFAULT_OPENAI_MODEL,
  DEFAULT_TEMPERATURE,
  OPENAI_ROLE_SYSTEM,
  OPENAI_ROLE_USER,
} from './constants';
import {
  getAccessRequestMessages,
  getAccessRequestUserPrompt,
  isValidAiRecommendation,
} from './utils';

@Injectable()
export class OpenAIService implements OnModuleInit {
  private readonly logger = new Logger(OpenAIService.name);
  private openai!: OpenAI;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
      });
    } else {
      this.logger.warn(
        'OPENAI_API_KEY not found in process.env, falling back to mock mode'
      );
    }
  }

  async generateResponse(
    messages: ChatMessage[],
    responseFormat?: ResponseFormat,
    model = DEFAULT_OPENAI_MODEL,
    temperature = DEFAULT_TEMPERATURE
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model,
        messages,
        temperature,
        ...(responseFormat && { response_format: responseFormat }),
      });

      return completion.choices[0].message?.content ?? '';
    } catch (error) {
      this.logger.error('OpenAI error:', error);
      throw error;
    }
  }

  async analyzeRequest(
    requestId: string,
    requestorEmail: string,
    subjectEmail: string,
    resource: string,
    reason: string,
    requestorMetadata?: EmployeeMetadata,
    subjectMetadata?: EmployeeMetadata
  ): Promise<AiRecommendation> {
    let aiRecommendation: AiRecommendation;

    if (!this.openai) {
      aiRecommendation = await this.mockAnalyzeRequest(
        requestorEmail,
        subjectEmail,
        resource,
        reason
      );
    } else {
      const userPrompt = getAccessRequestUserPrompt(
        requestorEmail,
        subjectEmail,
        resource,
        reason,
        requestorMetadata,
        subjectMetadata
      );

      const messages = getAccessRequestMessages(
        ACCESS_REQUEST_SYSTEM_PROMPT,
        userPrompt,
        OPENAI_ROLE_SYSTEM,
        OPENAI_ROLE_USER
      );

      try {
        const content = await this.generateResponse(
          messages,
          ACCESS_REQUEST_RESPONSE_FORMAT
        );

        if (!content) {
          throw new Error('OpenAI returned an empty response');
        }

        const result = JSON.parse(content);

        if (!isValidAiRecommendation(result)) {
          this.logger.error('Invalid AI response format', { result });
          throw new Error('AI response does not match the expected format');
        }

        aiRecommendation = {
          recommendation: result.recommendation,
          reasoning: result.reasoning,
          confidenceScore: result.confidenceScore,
        };
      } catch (error) {
        this.logger.error('Error analyzing request with OpenAI', error);
        throw error;
      }
    }

    // Save evaluation to DB
    try {
      await this.prisma.aiEvaluation.create({
        data: {
          requestId,
          recommendation: aiRecommendation.recommendation,
          reasoning: aiRecommendation.reasoning,
          confidenceScore: aiRecommendation.confidenceScore,
        },
      });
    } catch (dbError) {
      this.logger.error('Failed to save AI evaluation to database', dbError);
    }

    this.logger.log('AI Analysis successful', {
      requestId,
    });

    return aiRecommendation;
  }

  private async mockAnalyzeRequest(
    requestorName: string,
    subjectName: string,
    resource: string,
    reason: string
  ): Promise<AiRecommendation> {
    this.logger.log(
      `Mock analyzing request from ${requestorName} for ${subjectName}`
    );
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isSuspicious =
      reason.toLowerCase().includes('hack') ||
      resource.toLowerCase().includes('hack');
    return {
      recommendation: isSuspicious
        ? AI_RECOMMENDATION_DENY
        : AI_RECOMMENDATION_APPROVE,
      reasoning: isSuspicious
        ? 'Suspicious keywords detected (Mock).'
        : `Standard operational request for ${subjectName} (Mock).`,
      confidenceScore: 0.9,
    };
  }
}
