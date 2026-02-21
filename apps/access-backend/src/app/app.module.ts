import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccessRequestModule } from './access-request/access-request.module';
import { AuthModule } from './auth/auth.module';
import { OpenAIModule } from './openai/openai.module';
import { PrismaModule } from './db/prisma.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.NODE_ENV === 'local',
      introspection: process.env.NODE_ENV === 'local',
    }),
    AuthModule,
    AccessRequestModule,
    OpenAIModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
