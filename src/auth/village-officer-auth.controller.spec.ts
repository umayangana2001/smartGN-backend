import { Test, TestingModule } from '@nestjs/testing';
import { VillageOfficerAuthController } from './village-officer-auth.controller';
import { VillageOfficerAuthService } from './village-officer-auth.service';
import { RegisterVillageOfficerDto, LoginDto } from './dto';

describe('VillageOfficerAuthController', () => {
  let controller: VillageOfficerAuthController;
  let service: VillageOfficerAuthService;

  const mockVillageOfficerAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VillageOfficerAuthController],
      providers: [
        { provide: VillageOfficerAuthService, useValue: mockVillageOfficerAuthService },
      ],
    }).compile();

    controller = module.get<VillageOfficerAuthController>(VillageOfficerAuthController);
    service = module.get<VillageOfficerAuthService>(VillageOfficerAuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===================== REGISTER ENDPOINT TESTS =====================

  describe('register', () => {
    const registerDto: RegisterVillageOfficerDto = {
      email: 'officer@gn.gov.lk',
      password: 'password123',
      fullName: 'K. Perera',
      district: 'Colombo',
      division: 'Colombo North',
    };

    it('should call VillageOfficerAuthService.register with correct parameters', async () => {
      const expectedResult = {
        message: 'Village Officer registered successfully',
        villageOfficer: {
          id: 'uuid',
          email: registerDto.email,
          fullName: registerDto.fullName,
        },
      };
      mockVillageOfficerAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });

    it('should include village officer details in response', async () => {
      const expectedResult = {
        message: 'Village Officer registered successfully',
        villageOfficer: {
          fullName: registerDto.fullName,
          district: registerDto.district,
          division: registerDto.division,
        },
      };
      mockVillageOfficerAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(result.villageOfficer.fullName).toBe(registerDto.fullName);
      expect(result.villageOfficer.district).toBe(registerDto.district);
    });

    it('should propagate errors from service', async () => {
      mockVillageOfficerAuthService.register.mockRejectedValue(
        new Error('Email already registered'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Email already registered',
      );
    });
  });

  // ===================== LOGIN ENDPOINT TESTS =====================

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'officer@gn.gov.lk',
      password: 'password123',
    };

    it('should call VillageOfficerAuthService.login with correct parameters', async () => {
      const expectedResult = {
        message: 'Login successful',
        villageOfficer: { id: 'uuid', email: loginDto.email },
        access_token: 'jwt.officer.token',
      };
      mockVillageOfficerAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return JWT token on successful login', async () => {
      const mockToken = 'jwt.officer.token';
      mockVillageOfficerAuthService.login.mockResolvedValue({
        message: 'Login successful',
        access_token: mockToken,
      });

      const result = await controller.login(loginDto);

      expect(result.access_token).toBe(mockToken);
    });

    it('should propagate errors from service', async () => {
      mockVillageOfficerAuthService.login.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
