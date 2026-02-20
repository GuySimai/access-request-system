import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccessRequestModule } from './access-request/access-request.module';
import { AccessDecisionModule } from './access-decision/access-decision.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    AccessRequestModule,
    AccessDecisionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
