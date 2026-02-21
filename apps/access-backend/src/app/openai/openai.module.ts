import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { PrismaModule } from '../db/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
