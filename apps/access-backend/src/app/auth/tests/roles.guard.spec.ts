import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
    }),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: mockReflector }],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should return true if user has required role', () => {
    const requiredRoles = [Role.APPROVER];
    mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);

    const mockRequest = { user: { role: Role.APPROVER } };
    (
      mockExecutionContext.switchToHttp().getRequest as jest.Mock
    ).mockReturnValue(mockRequest);

    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should throw ForbiddenException if user does not have required role', () => {
    const requiredRoles = [Role.APPROVER];
    mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);

    const mockRequest = { user: { role: Role.EMPLOYEE } };
    (
      mockExecutionContext.switchToHttp().getRequest as jest.Mock
    ).mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException
    );
  });

  it('should throw ForbiddenException if no user in request', () => {
    const requiredRoles = [Role.APPROVER];
    mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);

    const mockRequest = {};
    (
      mockExecutionContext.switchToHttp().getRequest as jest.Mock
    ).mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException
    );
  });
});
