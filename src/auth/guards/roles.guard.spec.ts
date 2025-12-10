import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  // Helper to create mock ExecutionContext
  const createMockContext = (user: any): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext);

  describe('canActivate', () => {
    it('should return true if no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockContext({ role: Role.USER });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true if user has required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.USER]);
      const context = createMockContext({ role: Role.USER });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false if user does not have required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockContext({ role: Role.USER });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true if user has one of multiple required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.USER, Role.ADMIN]);
      const context = createMockContext({ role: Role.USER });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow VILLAGE_OFFICER role access', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.VILLAGE_OFFICER]);
      const context = createMockContext({ role: Role.VILLAGE_OFFICER });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should check roles using reflector with correct keys', () => {
      const mockHandler = jest.fn();
      const mockClass = jest.fn();
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: Role.USER } }),
        }),
        getHandler: () => mockHandler,
        getClass: () => mockClass,
      } as unknown as ExecutionContext;

      mockReflector.getAllAndOverride.mockReturnValue([Role.USER]);

      guard.canActivate(context);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        mockHandler,
        mockClass,
      ]);
    });

    it('should deny access when user role does not match any required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.VILLAGE_OFFICER]);
      const context = createMockContext({ role: Role.USER });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
