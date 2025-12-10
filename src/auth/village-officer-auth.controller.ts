import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VillageOfficerAuthService } from './village-officer-auth.service';
import { RegisterVillageOfficerDto, LoginDto } from './dto';

@ApiTags('auth/village-officer')
@Controller('auth/village-officer')
export class VillageOfficerAuthController {
  constructor(private villageOfficerAuthService: VillageOfficerAuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new village officer' })
  @ApiBody({ type: RegisterVillageOfficerDto })
  @ApiResponse({
    status: 201,
    description: 'Village officer registered successfully',
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterVillageOfficerDto) {
    return this.villageOfficerAuthService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Village officer login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.villageOfficerAuthService.login(dto);
  }
}
