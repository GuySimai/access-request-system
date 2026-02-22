import {
  Field,
  ObjectType,
  ID,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import { RequestStatus, Role } from '@access/prisma';

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
});

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class Employee {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field(() => Role)
  role!: Role;
}

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

  @Field(() => Employee)
  requestor!: Employee;

  @Field()
  requestorId!: string;

  @Field(() => Employee)
  subject!: Employee;

  @Field()
  subjectId!: string;

  @Field()
  resource!: string;

  @Field()
  reason!: string;

  @Field(() => RequestStatus)
  status!: RequestStatus;

  @Field(() => Employee, { nullable: true })
  approver?: Employee;

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
