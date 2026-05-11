import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@school.com';
    const password = 'Password123!';
    const passwordHash = await bcrypt.hash(password, 12);

    console.log(`Checking for admin role...`);
    let adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } });
    if (!adminRole) {
        adminRole = await prisma.role.create({
            data: { name: RoleName.ADMIN, description: 'Admin role' }
        });
    }

    console.log(`Resetting admin: ${email}...`);
    const user = await prisma.user.upsert({
        where: { email },
        update: { 
            passwordHash,
            emailVerifiedAt: new Date() 
        },
        create: {
            email,
            passwordHash,
            firstName: 'System',
            lastName: 'Admin',
            emailVerifiedAt: new Date(),
        }
    });

    // Ensure role assignment
    const existingRole = await prisma.userRole.findFirst({
        where: { userId: user.id, roleId: adminRole.id }
    });

    if (!existingRole) {
        await prisma.userRole.create({
            data: { userId: user.id, roleId: adminRole.id }
        });
    }

    console.log(`SUCCESS! Admin account is ready.`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
