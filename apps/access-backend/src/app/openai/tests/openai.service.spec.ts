import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIService } from '../openai.service';
import { PrismaService } from '../../db/prisma.service';

describe('OpenAIService', () => {
  let service: OpenAIService;
  let prisma: PrismaService;

  const mockPrisma = {
    aiEvaluation: {
      create: jest.fn(),
    },
  };

  const mockOpenAI = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAIService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
    prisma = module.get<PrismaService>(PrismaService);

    // Force inject mock openai
    (service as any).openai = mockOpenAI;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateResponse', () => {
    it('should return content from OpenAI', async () => {
      const mockContent = '{"recommendation":"APPROVE"}';
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: mockContent } }],
      });

      const result = await service.generateResponse([]);

      expect(result).toBe(mockContent);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
    });

    it('should throw error if OpenAI fails', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error('OpenAI Error')
      );

      await expect(service.generateResponse([])).rejects.toThrow(
        'OpenAI Error'
      );
    });
  });

  describe('analyzeRequest', () => {
    const mockParams = {
      requestId: '1',
      requestorEmail: 'req@monday.com',
      subjectEmail: 'sub@monday.com',
      resource: 'res',
      reason: 'reason',
    };

    it('should analyze and save evaluation', async () => {
      const mockAiResponse = JSON.stringify({
        recommendation: 'APPROVE',
        reasoning: 'looks good',
        confidenceScore: 0.9,
      });

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: mockAiResponse } }],
      });
      mockPrisma.aiEvaluation.create.mockResolvedValue({});

      const result = await service.analyzeRequest(
        mockParams.requestId,
        mockParams.requestorEmail,
        mockParams.subjectEmail,
        mockParams.resource,
        mockParams.reason
      );

      expect(result.recommendation).toBe('APPROVE');
      expect(prisma.aiEvaluation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          requestId: '1',
          recommendation: 'APPROVE',
        }),
      });
    });

    it('should use mock mode if openai is not initialized', async () => {
      (service as any).openai = null;

      const result = await service.analyzeRequest(
        mockParams.requestId,
        mockParams.requestorEmail,
        mockParams.subjectEmail,
        mockParams.resource,
        mockParams.reason
      );

      expect(result.confidenceScore).toBe(0.9);
      expect(prisma.aiEvaluation.create).toHaveBeenCalled();
    });
  });
});
