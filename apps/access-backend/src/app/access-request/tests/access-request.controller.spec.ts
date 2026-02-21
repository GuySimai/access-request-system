import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestController } from '../access-request.controller';
import { AccessRequestService } from '../access-request.service';
import { RequestStatus, Employee, Role } from '@access/prisma';
import { NotFoundException } from '@nestjs/common';

describe('AccessRequestController', () => {
  let controller: AccessRequestController;
  let service: AccessRequestService;

  const mockService = {
    createAccessRequest: jest.fn(),
    getAccessRequests: jest.fn(),
    getAccessRequestById: jest.fn(),
    handleAccessRequestDecision: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessRequestController],
      providers: [{ provide: AccessRequestService, useValue: mockService }],
    }).compile();

    controller = module.get<AccessRequestController>(AccessRequestController);
    service = module.get<AccessRequestService>(AccessRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAccessRequest', () => {
    it('should call service.createAccessRequest', async () => {
      const mockUser: Partial<Employee> = { id: '1', email: 'test@monday.com' };
      const mockDto = {
        subjectEmail: '2@monday.com',
        resource: 'res',
        reason: 'reason',
      };

      await controller.createAccessRequest(
        { user: mockUser as Employee },
        mockDto
      );

      expect(service.createAccessRequest).toHaveBeenCalledWith(
        mockUser,
        mockDto
      );
    });
  });

  describe('getAccessRequests', () => {
    it('should call service.getAccessRequests with query params', async () => {
      const mockQuery = { status: RequestStatus.PENDING };
      mockService.getAccessRequests.mockResolvedValue([]);

      await controller.getAccessRequests(mockQuery);

      expect(service.getAccessRequests).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe('handleAccessRequestDecision', () => {
    const mockUser: Partial<Employee> = {
      id: 'app-1',
      email: 'admin@monday.com',
      role: Role.APPROVER,
    };
    const mockDto = { status: RequestStatus.APPROVED };

    it('should update decision if request exists', async () => {
      mockService.getAccessRequestById.mockResolvedValue({ id: '1' });

      await controller.handleAccessRequestDecision(
        { user: mockUser as Employee },
        '1',
        mockDto
      );

      expect(service.handleAccessRequestDecision).toHaveBeenCalledWith(
        '1',
        mockUser,
        RequestStatus.APPROVED
      );
    });

    it('should throw NotFoundException if request does not exist', async () => {
      mockService.getAccessRequestById.mockResolvedValue(null);

      await expect(
        controller.handleAccessRequestDecision(
          { user: mockUser as Employee },
          '1',
          mockDto
        )
      ).rejects.toThrow(NotFoundException);
    });
  });
});
