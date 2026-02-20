import { Resolver, Query, Args } from '@nestjs/graphql';
import { AccessRequestService } from './access-request.service';
import { AccessRequest } from './models/access-request.model';
import { RequestStatus } from '../../../prisma/generated/client';

@Resolver(() => AccessRequest)
export class AccessRequestResolver {
  constructor(private readonly service: AccessRequestService) {}

  @Query(() => [AccessRequest], { name: 'accessRequests' })
  async getAccessRequests(
    @Args('requestorId', { nullable: true }) requestorId?: string,
    @Args('subjectId', { nullable: true }) subjectId?: string,
    @Args('status', { nullable: true, type: () => RequestStatus })
    status?: RequestStatus
  ) {
    return this.service.getAccessRequests({ requestorId, subjectId, status });
  }
}
