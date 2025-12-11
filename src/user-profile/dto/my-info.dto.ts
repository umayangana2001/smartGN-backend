import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsDateString } from 'class-validator';

export class MyInfoDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Address of the user', example: '123 Main Street' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'National Identity Card number', example: '123456789V' })
  @IsString()
  @IsNotEmpty()
  nic: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Telephone number', example: '+94771234567' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ description: 'District', example: 'Colombo' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: 'Division', example: 'Colombo North' })
  @IsString()
  @IsNotEmpty()
  division: string;

  @ApiProperty({ description: 'Birthday', example: '1990-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  birthday: string;
}
