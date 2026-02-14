import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGnDto {
  @ApiProperty({ example: 'gn@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Silva' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Colombo' })
  @IsOptional()
  district?: string;

  @ApiProperty({ example: 'Colombo 05' })
  @IsOptional()
  division?: string;
}
