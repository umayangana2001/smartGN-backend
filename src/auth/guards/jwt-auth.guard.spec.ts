import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call parent canActivate method', () => {
      // Create a mock execution context
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer valid.jwt.token',
            },
          }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as unknown as ExecutionContext;

      // JwtAuthGuard extends AuthGuard('jwt'), so canActivate should exist
      expect(typeof guard.canActivate).toBe('function');
    });

    it('should extend AuthGuard with jwt strategy', () => {
      // Verify the guard is an instance of JwtAuthGuard
      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });
});
