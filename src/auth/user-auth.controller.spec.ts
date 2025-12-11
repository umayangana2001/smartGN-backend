import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { RegisterUserDto, LoginDto } from './dto';

describe('UserAuthController', () => {
  let controller: UserAuthController;
  let service: UserAuthService;

  const mockUserAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [
        { provide: UserAuthService, useValue: mockUserAuthService },
      ],
    }).compile();

    controller = module.get<UserAuthController>(UserAuthController);
    service = module.get<UserAuthService>(UserAuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===================== REGISTER ENDPOINT TESTS =====================

  describe('register', () => {
    const registerDto: RegisterUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should call UserAuthService.register with correct parameters', async () => {
      const expectedResult = {
        message: 'User registered successfully',
        user: { id: 'uuid', email: registerDto.email },
      };
      mockUserAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
      mockUserAuthService.register.mockRejectedValue(new Error('Registration failed'));

      await expect(controller.register(registerDto)).rejects.toThrow('Registration failed');
    });
  });

  // ===================== LOGIN ENDPOINT TESTS =====================

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should call UserAuthService.login with correct parameters', async () => {
      const expectedResult = {
        message: 'Login successful',
        user: { id: 'uuid', email: loginDto.email },
        access_token: 'jwt.token.here',
      };
      mockUserAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return JWT token on successful login', async () => {
      const mockToken = 'jwt.token.here';
      mockUserAuthService.login.mockResolvedValue({
        message: 'Login successful',
        access_token: mockToken,
      });

      const result = await controller.login(loginDto);

      expect(result.access_token).toBe(mockToken);
    });

    it('should propagate errors from service', async () => {
      mockUserAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
