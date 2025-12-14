import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../enums';

export class RegisterUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role (USER or ADMIN). Defaults to USER if not provided.',
    enum: Role,
    example: Role.USER,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
