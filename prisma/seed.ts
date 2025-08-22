import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Example seed data, adjust according to your schema
    // Replace 'User', 'Post', etc. with your actual model names and fields

    // Add more seed data as needed for your schema
    // Seed Courses

    // delete all entries
    await prisma.course.deleteMany({});
    await prisma.module.deleteMany({});
    await prisma.user.deleteMany({});

    const course1 = await prisma.course.create({
        data: {
            title: 'Introduction to Programming',
            description: 'Learn the basics of programming using Python.',
            instructor: 'Dr. John Doe',
            price: 99.99,
            thumbnail_image: 'intro_programming.jpg',
            topics: {
                create: [
                    { name: 'Variables' },
                    { name: 'Control Flow' },
                    { name: 'Functions' }
                ]
            }
        }
    });

    const course2 = await prisma.course.create({
        data: {
            title: 'Web Development Fundamentals',
            description: 'A beginner-friendly course on web development.',
            instructor: 'Ms. Jane Smith',
            price: 129.99,
            thumbnail_image: 'web_dev_fundamentals.jpg',
            topics: {
                create: [
                    { name: 'HTML' },
                    { name: 'CSS' },
                    { name: 'JavaScript' }
                ]
            }
        }
    });

    // Seed Users
    const user1 = await prisma.user.create({
        data: {
            username: 'alice',
            email: 'alice@example.com',
            first_name: 'Alice',
            last_name: 'Smith',
            password_hash: bcrypt.hashSync('hashedpassword1', 10), // Replace with actual hash in production
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'bob',
            email: 'bob@example.com',
            first_name: 'Bob',
            last_name: 'Johnson',
            password_hash: bcrypt.hashSync('hashedpassword2', 10), // Replace with actual hash in production
        },
    });

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@example.com',
            first_name: 'Admin',
            last_name: 'User',
            password_hash: bcrypt.hashSync('hashedadminpassword', 10), // Replace with actual hash in production,
            is_admin: true,
        },
    });

    // Seed Modules for course1
    const module1 = await prisma.module.create({
        data: {
            course_id: course1.id,
            title: 'Getting Started',
            description: 'Introduction to the course and setup.',
            pdf_content: 'getting_started.pdf',
            video_content: 'getting_started.mp4',
            order: 1
        }
    });

    const module2 = await prisma.module.create({
        data: {
            course_id: course1.id,
            title: 'Variables and Data Types',
            description: 'Understanding variables and data types.',
            pdf_content: 'variables.pdf',
            video_content: 'variables.mp4',
            order: 2
        }
    });

    // Seed Modules for course2
    const module3 = await prisma.module.create({
        data: {
            course_id: course2.id,
            title: 'HTML Basics',
            description: 'Learn the basics of HTML.',
            pdf_content: 'html_basics.pdf',
            video_content: 'html_basics.mp4',
            order: 3
        },
    });

    const module4 = await prisma.module.create({
        data: {
            course_id: course2.id,
            title: 'CSS Fundamentals',
            description: 'Introduction to CSS.',
            pdf_content: 'css_fundamentals.pdf',
            video_content: 'css_fundamentals.mp4',
            order: 4
        }
    });

    // Seed Enrollments
    await prisma.enrollment.createMany({
        data: [
            {
                user_id: user1.id,
                course_id: course1.id,
            },
            {
                user_id: user2.id,
                course_id: course2.id,
            }
        ]
    });

    // Seed FinishedModules
    await prisma.userModuleProgress.createMany({
        data: [
            {
                user_id: user1.id,
                module_id: module1.id,
            },
            {
                user_id: user1.id,
                module_id: module2.id,
            },
            {
                user_id: user2.id,
                module_id: module3.id,
            },
            {
                user_id: user2.id,
                module_id: module4.id,
            }
        ]
    })
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });