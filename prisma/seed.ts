import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    await prisma.snippet.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash("123456", 10);
    const user = await prisma.user.create({
        data: {
            email: "demo@example.com",
            password: passwordHash,
            username: "demoUser",
            name: "Demo User",
            avatarUrl: "https://i.pravatar.cc/150?u=demoUser",
        },
    });

    const tags = await prisma.tag.createMany({
        data: [
            { name: "Algorithms", slug: "algorithms" },
            { name: "JavaScript", slug: "javascript" },
            { name: "Sorting", slug: "sorting" },
        ],
        skipDuplicates: true,
    });

    const allTags = await prisma.tag.findMany();

    await prisma.snippet.create({
        data: {
            title: "Loop Example",
            description: "In ra từ 0 tới n",
            code: "for(let i=0; i<n; i++) { console.log(i); }",
            language: "JavaScript",
            authorId: user.id,
            topics: {
                connect: [{ id: allTags.find((t) => t.slug === "javascript")?.id! }],
            },
        },
    });

    await prisma.snippet.create({
        data: {
            title: "Bubble Sort",
            description: "Thuật toán sắp xếp nổi bọt",
            code: `
        function bubbleSort(arr) {
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
              if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              }
            }
          }
          return arr;
        }
      `,
            language: "JavaScript",
            authorId: user.id,
            topics: {
                connect: [
                    { id: allTags.find((t) => t.slug === "algorithms")?.id! },
                    { id: allTags.find((t) => t.slug === "sorting")?.id! },
                ],
            },
        },
    });

    console.log("Seeding completed!");
}

main()
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
