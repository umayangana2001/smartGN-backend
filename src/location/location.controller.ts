import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('locations')
@Public() // ✅ Make entire controller public
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('provinces')
  getProvinces() {
    return this.locationService.getProvinces();
  }

  @Get('districts/:provinceId')
  getDistricts(@Param('provinceId') provinceId: string) {
    return this.locationService.getDistricts(provinceId);
  }

  @Get('divisions/:districtId')
  getDivisions(@Param('districtId') districtId: string) {
    return this.locationService.getDivisions(districtId);
  }
}
