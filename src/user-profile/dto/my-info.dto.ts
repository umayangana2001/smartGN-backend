import { ApiProperty } from '@nestjs/swagger';

export class MyInfoDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  fullName: string;

  @ApiProperty({ description: 'Address of the user', example: '123 Main Street' })
  address: string;

  @ApiProperty({ description: 'National Identity Card number', example: '123456789V' })
  nic: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'Telephone number', example: '+94771234567' })
  telephone: string;

  @ApiProperty({ description: 'District', example: 'Colombo' })
  district: string;

  @ApiProperty({ description: 'Division', example: 'Colombo North' })
  division: string;

  @ApiProperty({ description: 'Birthday', example: '1990-01-01T00:00:00.000Z' })
  birthday: Date;
}
