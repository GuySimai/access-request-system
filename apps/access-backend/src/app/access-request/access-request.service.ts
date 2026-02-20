import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateAccessRequestDto } from './dto/request/create-access-request.dto';
import { RequestStatus, Employee } from '@prisma/client';

@Injectable()
export class AccessRequestService {
  private readonly logger = new Logger(AccessRequestService.name);

  constructor(private prisma: PrismaService) {}

  async createAccessRequest(requestor: Employee, dto: CreateAccessRequestDto) {
    try {
      this.logger.log('createAccessRequest', {
        requestorId: requestor.id,
        payload: dto,
      });

      const subject = await this.prisma.employee.findUnique({
        where: { id: dto.subjectId },
      });

      if (!subject) {
        this.logger.error('createAccessRequest - subject not found', {
          payload: { subjectId: dto.subjectId },
        });
        throw new NotFoundException(
          `Subject employee with ID ${dto.subjectId} not found`
        );
      }

      await this.prisma.accessRequest.create({
        data: {
          requestorId: requestor.id,
          subjectId: dto.subjectId,
          resource: dto.resource,
          reason: dto.reason,
          status: RequestStatus.PENDING,
        },
      });
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
  }) {
    try {
      this.logger.log('getAccessRequests', {
        payload: filters,
      });
      return await this.prisma.accessRequest.findMany({
        where: {
          requestorId: filters.requestorId,
          subjectId: filters.subjectId,
          status: filters.status,
        },
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

      return await this.prisma.accessRequest.update({
        where: { id: requestId },
        data: {
          status,
          decisionBy: approver.id,
          decisionAt: new Date(),
        },
      });
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
    });
  }
}
