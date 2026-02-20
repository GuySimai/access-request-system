import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { RequestStatus } from '../../../prisma/generated/client';

@Injectable()
export class AccessDecisionService {
  private readonly logger = new Logger(AccessDecisionService.name);

  constructor(private prisma: PrismaService) {}

  async handleAccessRequestDecision(requestId: string, approverId: string, status: RequestStatus) {
    try {
      this.logger.log(`Updating status of request ${requestId} to ${status} by approver ${approverId}`);
      
      return await this.prisma.accessRequest.update({
        where: { id: requestId },
        data: {
          status,
          decisionBy: approverId,
          decisionAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Failed to update access request status', {
        error: (error as Error).message,
        requestId,
        approverId,
        status,
      });

      throw  error;
    }
  }
}
