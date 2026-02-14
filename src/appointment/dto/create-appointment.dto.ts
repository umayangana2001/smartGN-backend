import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsDateString, 
  IsEnum 
} from 'class-validator';
import { AppointmentType } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Birth Certificate Application' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Need birth certificate for school admission', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ 
    enum: AppointmentType,
    example: AppointmentType.CERTIFICATE_ISSUANCE 
  })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  appointmentType: AppointmentType;

  @ApiProperty({ required: false, example: 'clxyz123...' })
  @IsString()
  @IsOptional()
  officerId?: string;

  @ApiProperty({ required: false, example: 'clabc456...' })
  @IsString()
  @IsOptional()
  serviceRequestId?: string;
}