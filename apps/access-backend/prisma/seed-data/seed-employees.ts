import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with employees...');

  const employees = [
    {
      email: 'admin@monday.com',
      name: 'Admin User',
      password: '1234',
      role: Role.APPROVER,
      metadata: {
        department: 'Security',
        jobTitle: 'Security Director',
        tenureMonths: 48,
      },
    },
    {
      email: 'employee1@monday.com',
      name: 'Employee One',
      password: '1234',
      role: Role.EMPLOYEE,
      metadata: {
        department: 'Engineering',
        jobTitle: 'Senior Developer',
        tenureMonths: 24,
      },
    },
    {
      email: 'employee2@monday.com',
      name: 'Employee Two',
      password: '1234',
      role: Role.EMPLOYEE,
      metadata: {
        department: 'Product',
        jobTitle: 'Product Manager',
        tenureMonths: 12,
      },
    },
    {
      email: 'employee3@monday.com',
      name: 'Employee Three',
      password: '1234',
      role: Role.EMPLOYEE,
      metadata: {
        department: 'Marketing',
        jobTitle: 'Marketing Specialist',
        tenureMonths: 6,
      },
    },
    {
      email: 'employee4@monday.com',
      name: 'Employee Four',
      password: '1234',
      role: Role.EMPLOYEE,
      metadata: {
        department: 'HR',
        jobTitle: 'HR Generalist',
        tenureMonths: 18,
      },
    },
    {
      email: 'test-user@monday.com',
      name: 'Test User',
      password: 'password123',
      role: Role.EMPLOYEE,
      metadata: {
        department: 'Engineering',
        jobTitle: 'Junior Developer',
        tenureMonths: 3,
      },
    },
  ];

  for (const employee of employees) {
    const { metadata, ...employeeData } = employee;
    const upserted = await prisma.employee.upsert({
      where: { email: employee.email },
      update: {
        ...employeeData,
        metadata: {
          upsert: {
            create: metadata,
            update: metadata,
          },
        },
      },
      create: {
        ...employeeData,
        metadata: {
          create: metadata,
        },
      },
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
