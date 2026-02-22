import {
  Field,
  ObjectType,
  ID,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import { RequestStatus } from '@access/prisma';

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
});

@ObjectType()
export class AiEvaluation {
  @Field()
  recommendation!: string;

  @Field()
  reasoning!: string;

  @Field(() => Float)
  confidenceScore!: number;
}

@ObjectType()
export class AccessRequest {
  @Field(() => ID)
  id!: string;

  @Field()
  requestorId!: string;

  @Field()
  subjectId!: string;

  @Field()
  resource!: string;

  @Field()
  reason!: string;

  @Field(() => RequestStatus)
  status!: RequestStatus;

  @Field({ nullable: true })
  decisionBy?: string;

  @Field({ nullable: true })
  decisionAt?: Date;

  @Field(() => AiEvaluation, { nullable: true })
  aiEvaluation?: AiEvaluation;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
