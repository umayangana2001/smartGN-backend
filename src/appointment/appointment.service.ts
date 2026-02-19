import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus, AppointmentType } from '@prisma/client';
import { Role } from '../auth/enums';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, createAppointmentDto: CreateAppointmentDto) {
    if (createAppointmentDto.officerId) {
      const officer = await this.prisma.user.findUnique({
        where: {
          id: createAppointmentDto.officerId,
          role: { in: [Role.VILLAGE_OFFICER, Role.ADMIN] }
        }
      });

      if (!officer) {
        throw new NotFoundException('Officer not found');
      }

      const conflictingAppointment = await this.prisma.appointment.findFirst({
        where: {
          officerId: createAppointmentDto.officerId,
          date: createAppointmentDto.date,
          status: {
            in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]
          },
          OR: [
            {
              AND: [
                { startTime: { lte: createAppointmentDto.startTime } },
                { endTime: { gt: createAppointmentDto.startTime } },
              ]
            },
            {
              AND: [
                { startTime: { lt: createAppointmentDto.endTime } },
                { endTime: { gte: createAppointmentDto.endTime } },
              ]
            }
          ]
        }
      });

      if (conflictingAppointment) {
        throw new BadRequestException('Officer has a conflicting appointment at this time');
      }
    }

    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        userId,
        status: AppointmentStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        officer: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        serviceRequest: {
          select: {
            id: true,
            // Remove 'title: true' or use correct field
          }
        }
      }
    });
  }

  async findAll(userId: string, userRole: Role) {
    let where: any = {};

    if (userRole === Role.USER) {
      where.userId = userId;
    } else if (userRole === Role.VILLAGE_OFFICER) {
      where.officerId = userId;
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        officer: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        serviceRequest: {
          select: {
            id: true,
            // Remove 'title: true' or use correct field
          }
        }
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        officer: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        serviceRequest: {
          select: {
            id: true,
            // Remove 'title: true' or use correct field
          }
        }
      }
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (userRole === Role.USER && appointment.userId !== userId) {
      throw new ForbiddenException('You can only view your own appointments');
    }

    if (userRole === Role.VILLAGE_OFFICER && appointment.officerId !== userId) {
      throw new ForbiddenException('You can only view appointments assigned to you');
    }

    return appointment;
  }

  async update(id: string, userId: string, userRole: Role, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (userRole === Role.USER && appointment.userId !== userId) {
      throw new ForbiddenException('You can only update your own appointments');
    }

    if (userRole === Role.VILLAGE_OFFICER && appointment.officerId !== userId) {
      throw new ForbiddenException('You can only update appointments assigned to you');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        officer: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        serviceRequest: {
          select: {
            id: true,
            // Remove 'title: true' or use correct field
          }
        }
      }
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (userRole === Role.USER && appointment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own appointments');
    }

    return this.prisma.appointment.delete({
      where: { id }
    });
  }

  async getOfficerAppointments(officerId: string) {
    return this.prisma.appointment.findMany({
      where: {
        officerId,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
        }
      },
      orderBy: { date: 'asc' },
    });
  }
  async getBusySlots(officerId: string, date: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        officerId,
        date: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lte: new Date(`${date}T23:59:59.999Z`),
        },
        status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    return appointments.map(app => ({
      ...app,
      startTime: app.startTime.slice(0, 5)
    }));
  }


  async findOfficersByDivision(divisionId: string) {
    return this.prisma.user.findMany({
      where: {
        role: Role.VILLAGE_OFFICER,
        division: divisionId,
        isActive: true,      },
      select: {
        id: true,
        fullName: true,
        email: true,
        district: true,
        division: true,
      },
    });
  }

}