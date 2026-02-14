import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty({ example: 'Road Damage Issue' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The road in Colombo 05 is severely damaged.' })
  @IsNotEmpty()
  description: string;
}
