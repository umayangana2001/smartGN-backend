import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateServiceRequestDto {
  @ApiProperty({
    description: 'ID of the service type',
    example: 'uuid-of-service-type',
  })
  @IsString()
  @IsNotEmpty()
  serviceTypeId: string;

  @ApiProperty({
    description: 'Path to uploaded document (if any)',
    example: '/uploads/documents/document.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  documentPath?: string;

  @ApiProperty({
    description: 'Additional remarks or notes',
    example: 'Urgent request for processing',
    required: false,
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}

