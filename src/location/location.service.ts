import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  getProvinces() {
    return this.prisma.province.findMany({
      orderBy: { name: 'asc' },
    });
  }

  getDistricts(provinceId: string) {
    return this.prisma.district.findMany({
      where: { provinceId },
      orderBy: { name: 'asc' },
    });
  }

  getDivisions(districtId: string) {
    return this.prisma.division.findMany({
      where: { districtId },
      orderBy: { name: 'asc' },
    });
  }
}
