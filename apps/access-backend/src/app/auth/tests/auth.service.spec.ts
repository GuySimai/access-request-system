import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Employee, Role } from '@access/prisma';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrisma = {
    employee: {
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return an employee if found', async () => {
      const mockEmployee = { id: '1', email: 'test@monday.com', name: 'Test' };
      mockPrisma.employee.findUnique.mockResolvedValue(mockEmployee);

      const result = await service.validateUser('test@monday.com');
      expect(result).toEqual(mockEmployee);
      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@monday.com' },
      });
    });

    it('should return null if not found', async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('notfound@monday.com');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token and user info', async () => {
      const mockEmployee: Partial<Employee> = {
        id: '1',
        email: 'test@monday.com',
        name: 'Test',
        role: Role.EMPLOYEE,
      };
      const mockToken = 'signed-jwt-token';
      mockJwt.sign.mockReturnValue(mockToken);

      const result = await service.login(mockEmployee as Employee);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: '1',
          email: 'test@monday.com',
          name: 'Test',
          role: Role.EMPLOYEE,
        },
      });
      expect(jwt.sign).toHaveBeenCalledWith({
        email: mockEmployee.email,
        sub: mockEmployee.id,
        role: mockEmployee.role,
      });
    });
  });
});
