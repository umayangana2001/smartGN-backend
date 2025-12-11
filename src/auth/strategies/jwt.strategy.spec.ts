import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy, JwtPayload } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    // Set environment variable for testing
    process.env.JWT_SECRET = 'test-secret-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data from valid payload', async () => {
      const payload: JwtPayload = {
        sub: 'user-uuid-123',
        email: 'test@example.com',
        role: 'USER',
        type: 'user',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        type: payload.type,
      });
    });

    it('should correctly handle user type payload', async () => {
      const payload: JwtPayload = {
        sub: 'user-123',
        email: 'user@example.com',
        role: 'USER',
        type: 'user',
      };

      const result = await strategy.validate(payload);

      expect(result.type).toBe('user');
      expect(result.role).toBe('USER');
    });

    it('should correctly handle village_officer type payload', async () => {
      const payload: JwtPayload = {
        sub: 'officer-123',
        email: 'officer@gn.gov.lk',
        role: 'VILLAGE_OFFICER',
        type: 'village_officer',
      };

      const result = await strategy.validate(payload);

      expect(result.type).toBe('village_officer');
      expect(result.role).toBe('VILLAGE_OFFICER');
    });

    it('should map sub to id in returned object', async () => {
      const payload: JwtPayload = {
        sub: 'some-unique-id',
        email: 'test@example.com',
        role: 'USER',
        type: 'user',
      };

      const result = await strategy.validate(payload);

      expect(result.id).toBe('some-unique-id');
      expect(result).not.toHaveProperty('sub');
    });
  });
});
