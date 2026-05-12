import { PrismaClient, RoleName, Gender, EnrollmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  console.log('Seeding roles...');
  const roles = Object.values(RoleName);
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName} role` },
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.ADMIN } });
  const teacherRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.TEACHER } });
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.STUDENT } });

  console.log('Seeding admin...');
  await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      passwordHash: await bcrypt.hash('Password123!', 12),
      firstName: 'System',
      lastName: 'Admin',
      emailVerifiedAt: new Date(),
      userRoles: {
        create: { roleId: adminRole.id }
      }
    }
  });

  console.log('Seeding teacher...');
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      emailVerifiedAt: new Date(),
      userRoles: {
        create: { roleId: teacherRole.id }
      },
      teacherProfile: {
        create: {
          employeeNumber: 'T-001',
          department: 'Mathematics',
          hireDate: new Date(),
        }
      }
    },
    include: { teacherProfile: true }
  });

  const teacherProfile = teacherUser.teacherProfile!;

  console.log('Seeding class...');
  const mathClass = await prisma.class.upsert({
    where: { name_academicYear: { name: 'Grade 10 - Algebra', academicYear: '2025-2026' } },
    update: {},
    create: {
      name: 'Grade 10 - Algebra',
      gradeLevel: 10,
      academicYear: '2025-2026',
      homeroomTeacherId: teacherProfile.id,
      capacity: 30,
      room: 'Room 302',
    }
  });

  console.log('Seeding students and enrollments...');
  const studentsData = [
    { email: 'student1@school.com', firstName: 'John', lastName: 'Doe', num: 'S-001' },
    { email: 'student2@school.com', firstName: 'Alice', lastName: 'Johnson', num: 'S-002' },
    { email: 'student3@school.com', firstName: 'Bob', lastName: 'Brown', num: 'S-003' },
    { email: 'student4@school.com', firstName: 'Charlie', lastName: 'Davis', num: 'S-004' },
    { email: 'student5@school.com', firstName: 'Eva', lastName: 'Wilson', num: 'S-005' },
  ];

  for (const s of studentsData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        passwordHash,
        firstName: s.firstName,
        lastName: s.lastName,
        emailVerifiedAt: new Date(),
        userRoles: {
          create: { roleId: studentRole.id }
        },
        studentProfile: {
          create: {
            studentNumber: s.num,
            gender: Gender.MALE,
            enrollmentDate: new Date(),
          }
        }
      },
      include: { studentProfile: true }
    });

    // Enroll in class
    await prisma.enrollment.upsert({
      where: { 
        studentId_classId_academicYear: { 
          studentId: user.studentProfile!.id, 
          classId: mathClass.id, 
          academicYear: '2025-2026' 
        } 
      },
      update: {},
      create: {
        studentId: user.studentProfile!.id,
        classId: mathClass.id,
        academicYear: '2025-2026',
        status: EnrollmentStatus.ACTIVE
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
