import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateAccessRequestDto } from './dto/request/create-access-request.dto';
import { RequestStatus, Employee } from '@prisma/client';
import { OpenAIService } from '../openai/openai.service';

@Injectable()
export class AccessRequestService {
  private readonly logger = new Logger(AccessRequestService.name);

  constructor(
    private prisma: PrismaService,
    private openaiService: OpenAIService
  ) {}

  async createAccessRequest(requestor: Employee, dto: CreateAccessRequestDto) {
    try {
      this.logger.log('createAccessRequest', {
        requestorId: requestor.id,
        payload: dto,
      });

      const subject = await this.prisma.employee.findUnique({
        where: { email: dto.subjectEmail },
      });

      if (!subject) {
        this.logger.error('createAccessRequest - subject not found', {
          payload: { subjectEmail: dto.subjectEmail },
        });
        throw new NotFoundException(
          `Subject employee with email ${dto.subjectEmail} not found`
        );
      }

      const accessRequest = await this.prisma.accessRequest.create({
        data: {
          requestorId: requestor.id,
          subjectId: subject.id,
          resource: dto.resource,
          reason: dto.reason,
          status: RequestStatus.PENDING,
        },
      });

      try {
        const requestorWithMetadata = await this.prisma.employee.findUnique({
          where: { id: requestor.id },
          include: { metadata: true },
        });
        const subjectWithMetadata = await this.prisma.employee.findUnique({
          where: { id: subject.id },
          include: { metadata: true },
        });

        await this.openaiService.analyzeRequest(
          accessRequest.id,
          requestor.email,
          subject.email,
          dto.resource,
          dto.reason,
          requestorWithMetadata?.metadata ?? undefined,
          subjectWithMetadata?.metadata ?? undefined
        );
      } catch (aiError) {
        this.logger.error(
          'AI Analysis failed, but request was created',
          aiError
        );
      }

      return accessRequest;
    } catch (error) {
      this.logger.error('createAccessRequest', {
        requestorId: requestor.id,
        payload: dto,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async getAccessRequests(filters: {
    requestorId?: string;
    subjectId?: string;
    status?: RequestStatus;
    skip?: number;
    take?: number;
  }) {
    try {
      this.logger.log('getAccessRequests', {
        payload: filters,
      });

      const take = filters.take ?? 50;
      const skip = filters.skip ?? 0;

      return await this.prisma.accessRequest.findMany({
        where: {
          requestorId: filters.requestorId,
          subjectId: filters.subjectId,
          status: filters.status,
        },
        take,
        skip,
        include: {
          requestor: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          },
          subject: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          },
          approver: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          },
          aiEvaluation: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('getAccessRequests', {
        payload: filters,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async handleAccessRequestDecision(
    requestId: string,
    approver: Employee,
    status: RequestStatus
  ) {
    try {
      this.logger.log('handleAccessRequestDecision', {
        requestId,
        approverId: approver.id,
        payload: { status },
      });

      const updatedRequest = await this.prisma.accessRequest.update({
        where: { id: requestId },
        data: {
          status,
          decisionBy: approver.id,
          decisionAt: new Date(),
        },
        include: {
          aiEvaluation: true,
        },
      });

      return updatedRequest;
    } catch (error) {
      this.logger.error('handleAccessRequestDecision', {
        requestId,
        approverId: approver.id,
        payload: { status },
        error: (error as Error).message,
      });

      throw error;
    }
  }

  async getAccessRequestById(id: string) {
    return this.prisma.accessRequest.findUnique({
      where: { id },
      include: {
        aiEvaluation: true,
      },
    });
  }
}
