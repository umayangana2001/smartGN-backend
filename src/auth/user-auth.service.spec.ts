import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from './enums';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserAuthService', () => {
  let service: UserAuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    userProfile: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ===================== REGISTER TESTS =====================

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      nic: '200012345678',
      telephone: '0771234567',
      district: 'Colombo',
      division: 'Colombo 05',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';

      const createdUser = {
        id: 'user-uuid-123',
        email: registerDto.email,
        password: hashedPassword,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);
      mockPrismaService.userProfile.create.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          role: Role.USER,
        },
      });

      expect(mockPrismaService.userProfile.create).toHaveBeenCalled();

      expect(result.message).toBe('User registered successfully');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe(registerDto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user-id',
        email: registerDto.email,
        password: 'hashedPassword',
        role: Role.USER,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ===================== LOGIN TESTS =====================

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-uuid-123',
      email: loginDto.email,
      password: 'hashedPassword',
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should login user successfully and return JWT token', async () => {
      const mockToken = 'jwt.token.here';

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        type: 'user',
      });

      expect(result.access_token).toBe(mockToken);
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
