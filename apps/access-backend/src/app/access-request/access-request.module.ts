import { Module } from '@nestjs/common';
import { AccessRequestController } from './access-request.controller';
import { AccessRequestService } from './access-request.service';
import { PrismaService } from '../db/prisma.service';

@Module({
  controllers: [AccessRequestController],
  providers: [AccessRequestService, PrismaService],
  exports: [AccessRequestService],
})
export class AccessRequestModule {}
