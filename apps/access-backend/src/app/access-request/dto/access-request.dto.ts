import { IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../../../../prisma/generated/client';

export class CreateAccessRequestDto {
  @ApiProperty({
    description: 'The ID of the employee who is the subject of the request',
  })
  @IsUUID()
  @IsNotEmpty()
  subjectId!: string;

  @ApiProperty({ description: 'The resource to which access is requested' })
  @IsString()
  @IsNotEmpty()
  resource!: string;

  @ApiProperty({ description: 'The reason for the access request' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

export class DecisionDto {
  @ApiProperty({
    enum: RequestStatus,
    description: 'The decision (APPROVED or DENIED)',
  })
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}
