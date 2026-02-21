import { PrismaClient, Role, RequestStatus, Employee } from '@access/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Employees
  const employeesData = [
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
      name: 'John Doe',
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
      name: 'Jane Smith',
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
      name: 'Alice Johnson',
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
      name: 'Bob Wilson',
      password: '1234',
      role: Role.EMPLOYEE,
      metadata: {
        department: 'HR',
        jobTitle: 'HR Generalist',
        tenureMonths: 18,
      },
    },
  ];

  const employees: Employee[] = [];
  for (const data of employeesData) {
    const { metadata, ...employeeData } = data;
    const upserted = await prisma.employee.upsert({
      where: { email: data.email },
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
    employees.push(upserted);
    console.log(`✅ Employee: ${upserted.name} (${upserted.email})`);
  }

  const admin = employees.find((e) => e.role === Role.APPROVER);
  const regularEmployees = employees.filter((e) => e.role === Role.EMPLOYEE);

  if (!admin) {
    throw new Error('Admin user not found after seeding');
  }

  // 2. Create Access Requests
  console.log('📝 Creating access requests...');

  const resources = [
    'AWS S3 Bucket',
    'Production Database',
    'GitHub Repository',
    'Internal Wiki',
    'Customer Data',
  ];
  const reasons = [
    'Need to debug production issue',
    'Required for project Alpha',
    'Onboarding new team member',
    'Updating documentation',
    'Security audit',
  ];

  for (let i = 0; i < 30; i++) {
    const requestor =
      regularEmployees[Math.floor(Math.random() * regularEmployees.length)];
    const subject =
      regularEmployees[Math.floor(Math.random() * regularEmployees.length)];
    const status =
      Object.values(RequestStatus)[
        Math.floor(Math.random() * Object.values(RequestStatus).length)
      ];

    const request = await prisma.accessRequest.create({
      data: {
        requestorId: requestor.id,
        subjectId: subject.id,
        resource: resources[Math.floor(Math.random() * resources.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: status as RequestStatus,
        decisionBy: status !== RequestStatus.PENDING ? admin.id : null,
        decisionAt: status !== RequestStatus.PENDING ? new Date() : null,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 1000000000)
        ), // Random dates in the past
        aiEvaluation: {
          create: {
            recommendation: Math.random() > 0.5 ? 'APPROVE' : 'DENY',
            reasoning: 'Based on employee tenure and department history.',
            confidenceScore: Math.random(),
          },
        },
      },
    });
    console.log(`✅ Request created: ${request.resource} (${request.status})`);
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
