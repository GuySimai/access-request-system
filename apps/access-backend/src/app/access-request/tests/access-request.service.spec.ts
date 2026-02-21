import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestService } from '../access-request.service';
import { PrismaService } from '../../db/prisma.service';
import { RequestStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { OpenAIService } from '../../openai/openai.service';

describe('AccessRequestService', () => {
  let service: AccessRequestService;
  let prisma: PrismaService;

  const mockPrisma = {
    employee: {
      findUnique: jest.fn(),
    },
    accessRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockOpenAIService = {
    analyzeRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: OpenAIService, useValue: mockOpenAIService },
      ],
    }).compile();

    service = module.get<AccessRequestService>(AccessRequestService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccessRequest', () => {
    const mockRequestor = { id: 'req-1', email: 'req@monday.com', name: 'Req' };
    const mockDto = {
      subjectEmail: 'sub@monday.com',
      resource: 'res-1',
      reason: 'need access',
    };

    it('should create a request if subject exists', async () => {
      mockPrisma.employee.findUnique.mockResolvedValue({
        id: 'sub-1',
        email: 'sub@monday.com',
        name: 'Sub',
      });
      mockPrisma.accessRequest.create.mockResolvedValue({ id: 'acc-1' });

      await service.createAccessRequest(mockRequestor as any, mockDto);

      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { email: 'sub@monday.com' },
      });
      expect(prisma.accessRequest.create).toHaveBeenCalledWith({
        data: {
          requestorId: 'req-1',
          subjectId: 'sub-1',
          resource: 'res-1',
          reason: 'need access',
          status: RequestStatus.PENDING,
        },
      });
    });

    it('should throw NotFoundException if subject does not exist', async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);

      await expect(
        service.createAccessRequest(mockRequestor as any, mockDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAccessRequests', () => {
    it('should return a list of requests', async () => {
      const mockRequests = [{ id: '1', resource: 'res' }];
      mockPrisma.accessRequest.findMany.mockResolvedValue(mockRequests);

      const result = await service.getAccessRequests({
        status: RequestStatus.PENDING,
      });

      expect(result).toEqual(mockRequests);
      expect(prisma.accessRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: RequestStatus.PENDING },
        })
      );
    });
  });

  describe('handleAccessRequestDecision', () => {
    it('should update the request status', async () => {
      const mockApprover = { id: 'app-1', email: 'app@monday.com' };
      mockPrisma.accessRequest.update.mockResolvedValue({
        id: '1',
        status: RequestStatus.APPROVED,
      });

      const result = await service.handleAccessRequestDecision(
        '1',
        mockApprover as any,
        RequestStatus.APPROVED
      );

      expect(result.status).toBe(RequestStatus.APPROVED);
      expect(prisma.accessRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          data: expect.objectContaining({
            status: RequestStatus.APPROVED,
            decisionBy: 'app-1',
          }),
        })
      );
    });
  });
});
