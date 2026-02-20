import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestResolver } from '../access-request.resolver';
import { AccessRequestService } from '../access-request.service';
import { RequestStatus } from '@prisma/client';

describe('AccessRequestResolver', () => {
  let resolver: AccessRequestResolver;
  let service: AccessRequestService;

  const mockService = {
    getAccessRequests: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestResolver,
        { provide: AccessRequestService, useValue: mockService },
      ],
    }).compile();

    resolver = module.get<AccessRequestResolver>(AccessRequestResolver);
    service = module.get<AccessRequestService>(AccessRequestService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAccessRequests', () => {
    it('should call service.getAccessRequests with correct arguments', async () => {
      const filters = {
        requestorId: 'req-1',
        subjectId: 'sub-1',
        status: RequestStatus.APPROVED,
      };
      mockService.getAccessRequests.mockResolvedValue([]);

      await resolver.getAccessRequests(
        filters.requestorId,
        filters.subjectId,
        filters.status
      );

      expect(service.getAccessRequests).toHaveBeenCalledWith(filters);
    });

    it('should work with optional arguments', async () => {
      mockService.getAccessRequests.mockResolvedValue([]);

      await resolver.getAccessRequests();

      expect(service.getAccessRequests).toHaveBeenCalledWith({
        requestorId: undefined,
        subjectId: undefined,
        status: undefined,
      });
    });
  });
});
