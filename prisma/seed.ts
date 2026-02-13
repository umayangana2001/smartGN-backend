import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  // 🔐 SUPER ADMIN credentials
  const superAdminEmail = 'superadmin@gov.lk';
  const superAdminPassword = 'SuperAdmin@123'; // change later

  // 1️⃣ Check if SUPER_ADMIN already exists
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: Role.SUPER_ADMIN },
  });

  if (existingSuperAdmin) {
    console.log('ℹ️ Super Admin already exists, skipping creation.');
    return;
  }

  // 2️⃣ Hash password
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  // 3️⃣ Create SUPER_ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('✅ Super Admin created successfully');
  console.log(`Email: ${superAdmin.email}`);
  console.log(`Role: ${superAdmin.role}`);
  console.log(`ID: ${superAdmin.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
