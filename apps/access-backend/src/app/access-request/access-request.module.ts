import { Module } from '@nestjs/common';
import { AccessRequestController } from './access-request.controller';
import { AccessRequestService } from './access-request.service';
import { AccessRequestResolver } from './access-request.resolver';
import { OpenAIModule } from '../openai/openai.module';
import { PrismaModule } from '../db/prisma.module';

@Module({
  imports: [OpenAIModule, PrismaModule],
  controllers: [AccessRequestController],
  providers: [AccessRequestService, AccessRequestResolver],
  exports: [AccessRequestService],
})
export class AccessRequestModule {}
