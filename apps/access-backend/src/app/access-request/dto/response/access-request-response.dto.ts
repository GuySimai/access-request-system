import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@access/prisma';

export class AiEvaluationResponseDto {
  @ApiProperty({ example: 'APPROVE' })
  recommendation!: string;

  @ApiProperty({ example: 'Standard operational request' })
  reasoning!: string;

  @ApiProperty({ example: 0.95 })
  confidenceScore!: number;
}

export class AccessRequestResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id!: string;

  @ApiProperty({ example: 'uuid-requestor' })
  requestorId!: string;

  @ApiProperty({ example: 'uuid-subject' })
  subjectId!: string;

  @ApiProperty({ example: 'AWS S3 Bucket' })
  resource!: string;

  @ApiProperty({ example: 'Need access for project X' })
  reason!: string;

  @ApiProperty({ enum: ['PENDING', 'APPROVED', 'DENIED'], example: 'PENDING' })
  status!: RequestStatus;

  @ApiProperty({ example: 'uuid-approver', required: false, nullable: true })
  decisionBy!: string | null;

  @ApiProperty({
    example: '2026-02-20T10:00:00Z',
    required: false,
    nullable: true,
  })
  decisionAt!: Date | null;

  @ApiProperty({ example: '2026-02-20T09:00:00Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-02-20T09:00:00Z' })
  updatedAt!: Date;

  @ApiProperty({ type: AiEvaluationResponseDto, nullable: true })
  aiEvaluation?: AiEvaluationResponseDto | null;
}
