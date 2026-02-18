import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'citizen@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Nimal Perera' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '200012345678' })
  @IsString()
  @IsNotEmpty()
  nic: string;

  @ApiProperty({ example: '0771234567' })
  @IsString()
  @IsNotEmpty()
  telephone: string;


}
