import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
