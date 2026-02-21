import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessRequestDto {
  @ApiProperty({
    description: 'The email of the employee who is the subject of the request',
  })
  @IsEmail()
  @IsNotEmpty()
  subjectEmail!: string;

  @ApiProperty({ description: 'The resource to which access is requested' })
  @IsString()
  @IsNotEmpty()
  resource!: string;

  @ApiProperty({ description: 'The reason for the access request' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
