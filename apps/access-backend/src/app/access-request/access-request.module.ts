import { Module } from '@nestjs/common';
import { AccessRequestController } from './access-request.controller';
import { AccessRequestService } from './access-request.service';
import { AccessRequestResolver } from './access-request.resolver';
import { PrismaService } from '../db/prisma.service';

@Module({
  controllers: [AccessRequestController],
  providers: [AccessRequestService, AccessRequestResolver, PrismaService],
  exports: [AccessRequestService],
})
export class AccessRequestModule {}
