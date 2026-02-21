import { Resolver, Query, Args } from '@nestjs/graphql';
import { AccessRequestService } from './access-request.service';
import { AccessRequest } from './models/access-request.model';
import { RequestStatus, Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => AccessRequest)
@UseGuards(GqlAuthGuard, RolesGuard)
export class AccessRequestResolver {
  constructor(private readonly service: AccessRequestService) {}

  @Query(() => [AccessRequest], { name: 'accessRequests' })
  @Roles(Role.EMPLOYEE, Role.APPROVER)
  async getAccessRequests(
    @Args('requestorId', { nullable: true }) requestorId?: string,
    @Args('subjectId', { nullable: true }) subjectId?: string,
    @Args('skip', { nullable: true, type: () => Number }) skip?: number,
    @Args('take', { nullable: true, type: () => Number }) take?: number,
    @Args('status', { nullable: true, type: () => RequestStatus })
    status?: RequestStatus
  ) {
    return this.service.getAccessRequests({
      requestorId,
      subjectId,
      status,
      skip,
      take,
    });
  }
}
