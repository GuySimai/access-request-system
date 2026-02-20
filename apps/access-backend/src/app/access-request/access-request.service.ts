import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateAccessRequestDto } from './dto/access-request.dto';
import { RequestStatus } from '../../../prisma/generated/client';

@Injectable()
export class AccessRequestService {
  private readonly logger = new Logger(AccessRequestService.name);

  constructor(private prisma: PrismaService) {}

  async createAccessRequest(requestorId: string, dto: CreateAccessRequestDto) {
    try {
      this.logger.log(
        `Creating access request for subject ${dto.subjectId} by ${requestorId}`
      );
      await this.prisma.accessRequest.create({
        data: {
          requestorId,
          subjectId: dto.subjectId,
          resource: dto.resource,
          reason: dto.reason,
          status: RequestStatus.PENDING,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create access request', {
        error: (error as Error).message,
        requestorId,
        dto,
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
      this.logger.log(
        `Retrieving requests with filters: ${JSON.stringify(filters)}`
      );
      return await this.prisma.accessRequest.findMany({
        where: {
          requestorId: filters.requestorId,
          subjectId: filters.subjectId,
          status: filters.status,
        },
        include: {
          requestor: true,
          subject: true,
          approver: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('Failed to retrieve access requests', {
        error: (error as Error).message,
        filters,
      });
      throw error;
    }
  }
}
