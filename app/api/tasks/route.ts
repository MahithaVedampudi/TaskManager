import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    const whereCondition: any = {};
    if (projectId) whereCondition.projectId = parseInt(projectId);
    if (status) whereCondition.status = status;

    let tasks;
    if (user.role === "ADMIN") {
      // Admins see all tasks
      tasks = await prisma.task.findMany({
        where: whereCondition,
        include: {
          assignee: true,
          taskLogs: true,
          project: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Members see only tasks assigned to them or unassigned in their projects
      tasks = await prisma.task.findMany({
        where: {
          ...whereCondition,
          OR: [{ assignedTo: user.id }, { assignedTo: null }],
        },
        include: {
          assignee: true,
          taskLogs: true,
          project: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("[Task Manager] Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create tasks" },
        { status: 403 }
      );
    }

    const { title, description, projectId, assignedTo, priority, estimatedHours, dueDate } = await req.json();

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "Title and projectId are required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: parseInt(projectId),
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
        priority: priority || "MEDIUM",
        estimatedHours: estimatedHours || 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: assignedTo ? "PENDING" : "UNASSIGNED",
      },
      include: {
        assignee: true,
        project: true,
      },
    });

    return NextResponse.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Task Manager] Create task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

