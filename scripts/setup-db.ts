import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database setup...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@taskmanager.com" },
    update: {},
    create: {
      email: "admin@taskmanager.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin);

  // Create sample dev user
  const devPassword = await bcrypt.hash("dev123", 10);
  const dev = await prisma.user.upsert({
    where: { email: "dev@taskmanager.com" },
    update: {},
    create: {
      email: "dev@taskmanager.com",
      password: devPassword,
      name: "Developer User",
      role: "MEMBER",
    },
  });

  console.log("Developer user created:", dev);

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: "Sample Project",
      description: "A sample project to get started with Task Manager",
      members: {
        create: [
          { userId: admin.id, role: "ADMIN" },
          { userId: dev.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("Sample project created:", project);

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Setup project environment",
      description: "Install dependencies and configure build tools",
      projectId: project.id,
      assignedTo: dev.id,
      status: "IN_PROGRESS",
      priority: "HIGH",
      estimatedHours: 4,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Create API endpoints",
      description: "Build REST APIs for task management",
      projectId: project.id,
      assignedTo: dev.id,
      status: "PENDING",
      priority: "HIGH",
      estimatedHours: 8,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Design dashboard UI",
      description: "Create a responsive dashboard interface",
      projectId: project.id,
      status: "UNASSIGNED",
      priority: "MEDIUM",
      estimatedHours: 6,
    },
  });

  console.log("Sample tasks created");

  console.log("Database setup completed successfully!");
  console.log("\n=== Demo Credentials ===");
  console.log("Admin Account:");
  console.log("  Email: admin@taskmanager.com");
  console.log("  Password: admin123");
  console.log("\nDeveloper Account:");
  console.log("  Email: dev@taskmanager.com");
  console.log("  Password: dev123");
}

main()
  .catch((e) => {
    console.error("Error during setup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

