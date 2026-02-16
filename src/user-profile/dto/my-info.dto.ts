import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class MyInfoDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  nic: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  telephone: string;

  @ApiProperty()
  @IsString()
  birthday: string;

  @ApiProperty()
  @IsString()
  provinceId: string;

  @ApiProperty()
  @IsString()
  districtId: string;

  @ApiProperty()
  @IsString()
  divisionId: string;
}
