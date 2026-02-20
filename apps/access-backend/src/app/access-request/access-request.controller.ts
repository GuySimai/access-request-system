import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto } from './dto/access-request.dto';
import {
  RequestStatus,
  Role,
  Employee,
} from '../../../prisma/generated/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('access-requests')
@Controller('access-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessRequestController {
  constructor(private readonly service: AccessRequestService) {}

  @Post()
  @Roles(Role.EMPLOYEE, Role.APPROVER)
  @ApiOperation({ summary: 'Create a new access request' })
  @HttpCode(HttpStatus.CREATED)
  async createAccessRequest(
    @Req() { user }: { user: Employee },
    @Body() dto: CreateAccessRequestDto
  ) {
    await this.service.createAccessRequest(user, dto);
  }

  @Get()
  @Roles(Role.APPROVER)
  @ApiOperation({ summary: 'Retrieve access requests with filters' })
  async getAccessRequests(
    @Query('requestorId') requestorId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('status') status?: RequestStatus
  ) {
    return this.service.getAccessRequests({ requestorId, subjectId, status });
  }
}
