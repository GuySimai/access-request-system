import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';

export class DecisionDto {
  @ApiProperty({
    enum: RequestStatus,
    description: 'The decision (APPROVED or DENIED)',
  })
  @IsEnum(RequestStatus)
  @IsNotEmpty()
  status!: RequestStatus;
}
