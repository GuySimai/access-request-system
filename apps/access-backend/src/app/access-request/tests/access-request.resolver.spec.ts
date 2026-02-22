import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestResolver } from '../access-request.resolver';
import { AccessRequestService } from '../access-request.service';
import { RequestStatus } from '@access/prisma';

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
        requestorEmail: 'req-1',
        subjectEmail: 'sub-1',
        status: RequestStatus.APPROVED,
        skip: undefined,
        take: undefined,
      };
      mockService.getAccessRequests.mockResolvedValue([]);

      await resolver.getAccessRequests(
        filters.requestorEmail,
        filters.subjectEmail,
        undefined,
        undefined,
        filters.status
      );

      expect(service.getAccessRequests).toHaveBeenCalledWith(filters);
    });

    it('should work with optional arguments', async () => {
      mockService.getAccessRequests.mockResolvedValue([]);

      await resolver.getAccessRequests();

      expect(service.getAccessRequests).toHaveBeenCalledWith({
        requestorEmail: undefined,
        subjectEmail: undefined,
        status: undefined,
        skip: undefined,
        take: undefined,
      });
    });
  });
});
