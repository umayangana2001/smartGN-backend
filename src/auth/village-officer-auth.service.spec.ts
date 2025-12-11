import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { VillageOfficerAuthService } from './village-officer-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from './enums';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('VillageOfficerAuthService', () => {
  let service: VillageOfficerAuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    villageOfficer: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VillageOfficerAuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<VillageOfficerAuthService>(VillageOfficerAuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ===================== REGISTER TESTS =====================

  describe('register', () => {
    const registerDto = {
      email: 'officer@gn.gov.lk',
      password: 'password123',
      fullName: 'K. Perera',
      district: 'Colombo',
      division: 'Colombo North',
    };

    it('should register a new village officer successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdOfficer = {
        id: 'officer-uuid-123',
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
        district: registerDto.district,
        division: registerDto.division,
        role: Role.VILLAGE_OFFICER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.villageOfficer.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.villageOfficer.create.mockResolvedValue(createdOfficer);

      const result = await service.register(registerDto);

      expect(mockPrismaService.villageOfficer.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.villageOfficer.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          fullName: registerDto.fullName,
          district: registerDto.district,
          division: registerDto.division,
          role: Role.VILLAGE_OFFICER,
        },
      });
      expect(result.message).toBe('Village Officer registered successfully');
      expect(result.villageOfficer).not.toHaveProperty('password');
      expect(result.villageOfficer.fullName).toBe(registerDto.fullName);
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingOfficer = {
        id: 'existing-officer-id',
        email: registerDto.email,
        password: 'hashedPassword',
        role: Role.VILLAGE_OFFICER,
      };

      mockPrismaService.villageOfficer.findUnique.mockResolvedValue(existingOfficer);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email already registered',
      );
    });

    it('should store district and division correctly', async () => {
      const hashedPassword = 'secureHash';
      mockPrismaService.villageOfficer.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.villageOfficer.create.mockResolvedValue({
        id: 'uuid',
        ...registerDto,
        password: hashedPassword,
        role: Role.VILLAGE_OFFICER,
      });

      const result = await service.register(registerDto);

      expect(result.villageOfficer.district).toBe(registerDto.district);
      expect(result.villageOfficer.division).toBe(registerDto.division);
    });
  });

  // ===================== LOGIN TESTS =====================

  describe('login', () => {
    const loginDto = {
      email: 'officer@gn.gov.lk',
      password: 'password123',
    };

    const mockOfficer = {
      id: 'officer-uuid-123',
      email: loginDto.email,
      password: 'hashedPassword',
      fullName: 'K. Perera',
      district: 'Colombo',
      division: 'Colombo North',
      role: Role.VILLAGE_OFFICER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should login village officer successfully and return JWT token', async () => {
      const mockToken = 'jwt.officer.token';
      mockPrismaService.villageOfficer.findUnique.mockResolvedValue(mockOfficer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(mockPrismaService.villageOfficer.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockOfficer.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockOfficer.id,
        email: mockOfficer.email,
        role: mockOfficer.role,
        type: 'village_officer',
      });
      expect(result.message).toBe('Login successful');
      expect(result.access_token).toBe(mockToken);
      expect(result.villageOfficer).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if officer not found', async () => {
      mockPrismaService.villageOfficer.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.villageOfficer.findUnique.mockResolvedValue(mockOfficer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should include type "village_officer" in JWT payload', async () => {
      mockPrismaService.villageOfficer.findUnique.mockResolvedValue(mockOfficer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      await service.login(loginDto);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'village_officer' }),
      );
    });
  });
});
