import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterVillageOfficerDto {
  @ApiProperty({
    description: 'Email address',
    example: 'officer@gn.gov.lk',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Full name of the village officer',
    example: 'K. Perera',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'District',
    example: 'Colombo',
  })
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    description: 'Division',
    example: 'Colombo North',
  })
  @IsNotEmpty()
  division: string;
}
