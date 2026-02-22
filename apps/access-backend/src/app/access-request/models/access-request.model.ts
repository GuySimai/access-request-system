import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { RequestStatus } from '@access/prisma';

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
});

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

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
