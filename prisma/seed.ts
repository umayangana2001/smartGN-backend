import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

/* ======================================================
   📍 LOCATION DATA (SHORTENED EXAMPLE VERSION)
====================================================== */

const locationData = [
  {
    province: 'Western',
    districts: [
      {
        name: 'Colombo',
        divisions: ['Colombo', 'Kotte', 'Maharagama', 'Dehiwala', 'Homagama'],
      },
      {
        name: 'Gampaha',
        divisions: ['Gampaha', 'Negombo', 'Ja-Ela', 'Kelaniya', 'Minuwangoda'],
      },
      {
        name: 'Kalutara',
        divisions: ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Mathugama'],
      },
    ],
  },
  {
    province: 'Sabaragamuwa',
    districts: [
      {
        name: 'Kegalle',
        divisions: ['Kegalle', 'Ruwanwella', 'Mawanella', 'Warakapola', 'Deraniyagala'],
      },
      {
        name: 'Ratnapura',
        divisions: ['Ratnapura', 'Balangoda', 'Eheliyagoda', 'Pelmadulla', 'Kuruwita'],
      },
    ],
  },
  {
    province: 'Southern',
    districts: [
      {
        name: 'Galle',
        divisions: ['Galle', 'Ambalangoda', 'Elpitiya', 'Habaraduwa', 'Baddegama'],
      },
      {
        name: 'Matara',
        divisions: ['Matara', 'Weligama', 'Akuressa', 'Hakmana', 'Kamburupitiya'],
      },
      {
        name: 'Hambantota',
        divisions: ['Hambantota', 'Tangalle', 'Beliatta', 'Ambalantota', 'Tissamaharama'],
      },
    ],
  },
];

/* ======================================================
   🌍 SEED LOCATIONS
====================================================== */

async function seedLocations() {
  console.log('🌍 Seeding Locations...');

  for (const provinceData of locationData) {
    const province = await prisma.province.create({
      data: { name: provinceData.province },
    });

    for (const districtData of provinceData.districts) {
      const district = await prisma.district.create({
        data: {
          name: districtData.name,
          provinceId: province.id,
        },
      });

      const divisions = districtData.divisions.map((division) => ({
        name: division,
        districtId: district.id,
      }));

      await prisma.division.createMany({
        data: divisions,
      });
    }
  }

  console.log('✅ Locations Seeded Successfully');
}

/* ======================================================
   🔐 SEED SUPER ADMIN
====================================================== */

async function seedSuperAdmin() {
  console.log('🔐 Seeding Super Admin...');

  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: Role.SUPER_ADMIN },
  });

  if (existingSuperAdmin) {
    console.log('ℹ️ Super Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);

  await prisma.user.create({
    data: {
      email: 'superadmin@gov.lk',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('✅ Super Admin Created');
}

/* ======================================================
   🚀 MAIN
====================================================== */

async function main() {
  await seedLocations();
  await seedSuperAdmin();
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
