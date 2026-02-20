import { Module } from '@nestjs/common';
import { AccessRequestModule } from './access-request/access-request.module';
import { AccessDecisionModule } from './access-decision/access-decision.module';

@Module({
  imports: [AccessRequestModule, AccessDecisionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
