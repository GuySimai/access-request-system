import {
  Controller,
  Patch,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccessDecisionService } from './access-decision.service';
import { DecisionDto } from './dto/access-decision.dto';
import { Role, Employee } from '../../../prisma/generated/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('access-decisions')
@Controller('access-decisions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessDecisionController {
  constructor(private readonly service: AccessDecisionService) {}

  @Patch(':id')
  @Roles(Role.APPROVER)
  @ApiOperation({ summary: 'Approve or deny an access request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleAccessRequestDecision(
    @Req() { user }: { user: Employee },
    @Param('id') id: string,
    @Body() dto: DecisionDto
  ) {
    await this.service.handleAccessRequestDecision(id, user, dto.status);
  }
}
