import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto } from './dto/access-request.dto';
import { RequestStatus } from '../../../prisma/generated/client';
import type { IAuthorizedRequest } from './types';

@ApiTags('access-requests')
@Controller('access-requests')
@ApiSecurity('authorization')
export class AccessRequestController {
  constructor(private readonly service: AccessRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new access request' })
  @HttpCode(HttpStatus.CREATED)
  async createAccessRequest(
    @Req() { user }: IAuthorizedRequest,
    @Body() dto: CreateAccessRequestDto
  ) {
    await this.service.createAccessRequest(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve access requests with filters' })
  async getAccessRequests(
    @Query('requestorId') requestorId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('status') status?: RequestStatus
  ) {
    return this.service.getAccessRequests({ requestorId, subjectId, status });
  }
}
