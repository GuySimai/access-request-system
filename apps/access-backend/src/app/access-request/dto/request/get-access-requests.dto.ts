import { IsOptional, IsEnum, IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';
import { Type } from 'class-transformer';

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

  @ApiPropertyOptional({ description: 'Number of records to skip', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description: 'Number of records to take',
    default: 50,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
