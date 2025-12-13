import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export class UpdateRequestStatusDto {
  @ApiProperty({
    description: 'Status of the request',
    enum: RequestStatus,
    example: RequestStatus.ACCEPTED,
    required: false,
  })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @ApiProperty({
    description: 'Verification status of the request',
    enum: VerificationStatus,
    example: VerificationStatus.VERIFIED,
    required: false,
  })
  @IsEnum(VerificationStatus)
  @IsOptional()
  verificationStatus?: VerificationStatus;

  @ApiProperty({
    description: 'Additional remarks when updating status',
    example: 'All documents verified and approved',
    required: false,
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}

