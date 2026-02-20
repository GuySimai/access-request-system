import { PrismaClient, Role } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with employees...');

  const employees = [
    {
      email: 'admin@monday.com',
      name: 'Admin User',
      role: Role.APPROVER,
    },
    {
      email: 'employee1@monday.com',
      name: 'Employee One',
      role: Role.EMPLOYEE,
    },
    {
      email: 'employee2@monday.com',
      name: 'Employee Two',
      role: Role.EMPLOYEE,
    },
    {
      email: 'employee3@monday.com',
      name: 'Employee Three',
      role: Role.EMPLOYEE,
    },
    {
      email: 'employee4@monday.com',
      name: 'Employee Four',
      role: Role.EMPLOYEE,
    },
  ];

  for (const employee of employees) {
    const upserted = await prisma.employee.upsert({
      where: { email: employee.email },
      update: employee,
      create: employee,
    });
    console.log(
      `✅ ${upserted.role}: ${upserted.name} (${upserted.email}) - ID: ${upserted.id}`
    );
  }

  console.log('🚀 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
