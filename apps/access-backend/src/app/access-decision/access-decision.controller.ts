import { Controller, Patch, Param, Body, Req, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AccessDecisionService } from './access-decision.service';
import { DecisionDto } from './dto/access-decision.dto';
import { Role } from '../../../prisma/generated/client';
import type { IAuthorizedRequest } from '../access-request/types';

@ApiTags('access-decisions')
@Controller('access-decisions')
@ApiSecurity('authorization')
export class AccessDecisionController {
  constructor(private readonly service: AccessDecisionService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Approve or deny an access request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleAccessRequestDecision(
    @Req() { user }: IAuthorizedRequest,
    @Param('id') id: string,
    @Body() dto: DecisionDto
  ) {
    if (user.role !== Role.APPROVER) {
      throw new UnauthorizedException('Only approvers can make decisions on requests');
    }
    await this.service.handleAccessRequestDecision(id, user.id, dto.status);
  }
}
