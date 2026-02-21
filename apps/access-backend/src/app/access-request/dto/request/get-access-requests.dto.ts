import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '@access/prisma';
import { Type } from 'class-transformer';

export class GetAccessRequestsDto {
  @ApiPropertyOptional({ description: 'Filter by requestor email' })
  @IsOptional()
  requestorEmail?: string;

  @ApiPropertyOptional({ description: 'Filter by subject email' })
  @IsOptional()
  subjectEmail?: string;

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
