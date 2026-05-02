import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const taskId = parseInt(id);
    if (Number.isNaN(taskId)) {
      return NextResponse.json(
        { error: "Invalid task id" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: true,
        taskLogs: true,
        project: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("[v0] Get task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const taskId = parseInt(id);
    if (Number.isNaN(taskId)) {
      return NextResponse.json(
        { error: "Invalid task id" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { title, description, status, priority, assignedTo, estimatedHours, actualHours, dueDate } = body;

    const parsedAssignedTo = assignedTo !== undefined ? (assignedTo ? parseInt(assignedTo) : null) : undefined;
    const parsedEstimatedHours = estimatedHours !== undefined ? Number(estimatedHours) : undefined;
    const parsedActualHours = actualHours !== undefined ? Number(actualHours) : undefined;
    const parsedDueDate = dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined;

    // Members can only update tasks assigned to them, and only update status and actualHours.
    if (user.role !== "ADMIN") {
      if (task.assignedTo !== user.id) {
        return NextResponse.json(
          { error: "Members can only update tasks assigned to them" },
          { status: 403 }
        );
      }

      if (
        title !== undefined ||
        description !== undefined ||
        priority !== undefined ||
        assignedTo !== undefined ||
        estimatedHours !== undefined ||
        parsedDueDate !== undefined
      ) {
        return NextResponse.json(
          { error: "Members can only update task status and actual hours" },
          { status: 403 }
        );
      }
    }

    // Admins can update everything
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (parsedAssignedTo !== undefined) updateData.assignedTo = parsedAssignedTo;
    if (parsedEstimatedHours !== undefined) updateData.estimatedHours = parsedEstimatedHours;
    if (parsedActualHours !== undefined) updateData.actualHours = parsedActualHours;
    if (parsedDueDate !== undefined) updateData.dueDate = parsedDueDate;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: true,
        taskLogs: true,
        project: true,
      },
    });

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete tasks" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const taskId = parseInt(id);
    if (Number.isNaN(taskId)) {
      return NextResponse.json(
        { error: "Invalid task id" },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Delete task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
