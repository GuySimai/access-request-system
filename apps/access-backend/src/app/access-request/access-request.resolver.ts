import { Resolver, Query, Args } from '@nestjs/graphql';
import { AccessRequestService } from './access-request.service';
import { AccessRequest } from './models/access-request.model';
import { RequestStatus, Role } from '@access/prisma';
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
    @Args('requestorEmail', { nullable: true }) requestorEmail?: string,
    @Args('subjectEmail', { nullable: true }) subjectEmail?: string,
    @Args('skip', { nullable: true, type: () => Number }) skip?: number,
    @Args('take', { nullable: true, type: () => Number }) take?: number,
    @Args('status', { nullable: true, type: () => RequestStatus })
    status?: RequestStatus
  ) {
    return this.service.getAccessRequests({
      requestorEmail,
      subjectEmail,
      status,
      skip,
      take,
    });
  }
}
