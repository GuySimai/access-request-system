import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  Get,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto } from './dto/request/create-access-request.dto';
import { DecisionDto } from './dto/request/decision.dto';
import { GetAccessRequestsDto } from './dto/request/get-access-requests.dto';
import { AccessRequestResponseDto } from './dto/response/access-request-response.dto';
import { Role, Employee } from '@prisma/client';
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
  @ApiCreatedResponse({
    description: 'The access request has been successfully created.',
  })
  @HttpCode(HttpStatus.CREATED)
  async createAccessRequest(
    @Req() { user }: { user: Employee },
    @Body() dto: CreateAccessRequestDto
  ) {
    await this.service.createAccessRequest(user, dto);
  }

  @Get()
  @Roles('APPROVER')
  @ApiOperation({ summary: 'Retrieve access requests with filters' })
  @ApiOkResponse({ type: [AccessRequestResponseDto] })
  async getAccessRequests(
    @Query() query: GetAccessRequestsDto
  ): Promise<AccessRequestResponseDto[]> {
    return this.service.getAccessRequests(query);
  }

  @Patch(':id/decision')
  @Roles('APPROVER')
  @ApiOperation({ summary: 'Approve or deny an access request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleAccessRequestDecision(
    @Req() { user }: { user: Employee },
    @Param('id') id: string,
    @Body() dto: DecisionDto
  ) {
    const request = await this.service.getAccessRequestById(id);
    if (!request) {
      throw new NotFoundException(`Access request with ID ${id} not found`);
    }
    await this.service.handleAccessRequestDecision(id, user, dto.status);
  }
}
