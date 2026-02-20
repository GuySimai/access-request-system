import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';

export class GetAccessRequestsDto {
  @ApiPropertyOptional({ description: 'Filter by requestor ID' })
  @IsOptional()
  @IsUUID()
  requestorId?: string;

  @ApiPropertyOptional({ description: 'Filter by subject ID' })
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiPropertyOptional({
    enum: RequestStatus,
    description: 'Filter by request status',
  })
  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'DENIED'], {
    message: 'status must be one of: PENDING, APPROVED, DENIED',
  })
  status?: RequestStatus;
}
