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
    const taskId = searchParams.get("taskId");

    const whereCondition: any = {};
    if (taskId) whereCondition.taskId = parseInt(taskId);

    let taskLogs;
    if (user.role === "ADMIN") {
      taskLogs = await prisma.taskLog.findMany({
        where: whereCondition,
        include: {
          task: true,
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      taskLogs = await prisma.taskLog.findMany({
        where: {
          ...whereCondition,
          userId: user.id,
        },
        include: {
          task: true,
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ taskLogs }, { status: 200 });
  } catch (error) {
    console.error("[Task Manager] Get task logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { taskId, hoursWorked, notes } = await req.json();

    if (!taskId || !hoursWorked) {
      return NextResponse.json(
        { error: "taskId and hoursWorked are required" },
        { status: 400 }
      );
    }

    // Verify user can log hours on this task
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Members can only log hours on their own tasks
    if (user.role !== "ADMIN" && task.assignedTo !== user.id) {
      return NextResponse.json(
        { error: "You can only log hours on tasks assigned to you" },
        { status: 403 }
      );
    }

    // Create task log
    const taskLog = await prisma.taskLog.create({
      data: {
        taskId: parseInt(taskId),
        userId: user.id,
        hoursWorked: parseFloat(hoursWorked.toString()),
        notes,
      },
      include: {
        task: true,
        user: true,
      },
    });

    // Update task's actualHours
    const totalHours = await prisma.taskLog.aggregate({
      where: { taskId: parseInt(taskId) },
      _sum: { hoursWorked: true },
    });

    await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        actualHours: totalHours._sum.hoursWorked || 0,
      },
    });

    return NextResponse.json(
      { message: "Hours logged successfully", taskLog },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Task Manager] Create task log error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

