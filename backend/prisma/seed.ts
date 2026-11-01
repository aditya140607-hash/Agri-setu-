// @ts-ignore
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Fallback PrismaClient instantiation if not generated yet
const prisma: any = typeof PrismaClient !== 'undefined' ? new PrismaClient() : {};

async function main() {
  console.log('Seeding AGRI-SETU database...');

  const salt = await bcrypt.genSalt(10);
  const farmerPassword = await bcrypt.hash('farmer123', salt);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const expertPassword = await bcrypt.hash('expert123', salt);

  // 1. Create Demo Farmer User & Profile
  await prisma.user.upsert({
    where: { mobileNumber: '9876543210' },
    update: {},
    create: {
      fullName: 'Rameshwar Patil',
      mobileNumber: '9876543210',
      email: 'rameshwar.patil@agrisetu.in',
      passwordHash: farmerPassword,
      role: 'FARMER',
      preferredLanguage: 'HI',
      farmerProfile: {
        create: {
          state: 'Maharashtra',
          district: 'Nashik',
          village: 'Deola',
          landSize: 4.5,
          soilType: 'Black Clay Loam',
          irrigation: 'Drip & Well Irrigation',
        },
      },
    },
  });

  // 2. Create Demo Admin User
  await prisma.user.upsert({
    where: { mobileNumber: '9988776655' },
    update: {},
    create: {
      fullName: 'Dr. Anand Verma',
      mobileNumber: '9988776655',
      email: 'admin@agrisetu.in',
      passwordHash: adminPassword,
      role: 'ADMIN',
      preferredLanguage: 'EN',
    },
  });

  // 3. Create Demo Expert User & Profile
  await prisma.user.upsert({
    where: { mobileNumber: '9812345678' },
    update: {},
    create: {
      fullName: 'Dr. Sunita Sharma',
      mobileNumber: '9812345678',
      email: 'expert.sharma@agrisetu.in',
      passwordHash: expertPassword,
      role: 'EXPERT',
      preferredLanguage: 'HI',
      expertProfile: {
        create: {
          specialization: 'Crop Protection & Integrated Pest Management',
          kvkName: 'Krishi Vigyan Kendra (KVK) Nashik',
          location: 'Nashik, Maharashtra',
          experienceYears: 14,
          contactInformation: 'dr.sharma.kvk@icar.gov.in',
        },
      },
    },
  });

  console.log('Seed completed successfully for AGRI-SETU.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma.$disconnect) {
      await prisma.$disconnect();
    }
  });
