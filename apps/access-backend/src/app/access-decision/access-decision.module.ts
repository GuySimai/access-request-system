import { Module } from '@nestjs/common';
import { AccessDecisionController } from './access-decision.controller';
import { AccessDecisionService } from './access-decision.service';
import { PrismaService } from '../db/prisma.service';

@Module({
  controllers: [AccessDecisionController],
  providers: [AccessDecisionService, PrismaService],
})
export class AccessDecisionModule {}
