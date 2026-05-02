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

    let projects;
    if (user.role === "ADMIN") {
      // Admins see all projects
      projects = await prisma.project.findMany({
        include: {
          members: {
            include: {
              user: true,
            },
          },
          tasks: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Members see only projects they're part of
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
          tasks: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("[Task Manager] Get projects error:", error);
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
        { error: "Only admins can create projects" },
        { status: 403 }
      );
    }

    const { name, description, memberIds } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
      },
    });

    // Add members if provided
    if (memberIds && Array.isArray(memberIds)) {
      await Promise.all(
        memberIds.map((memberId: number) =>
          prisma.projectMember.create({
            data: {
              userId: memberId,
              projectId: project.id,
              role: "MEMBER",
            },
          }).catch(() => {}) // Ignore duplicates
        )
      );
    }

    // Fetch created project with members
    const projectWithMembers = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
      },
    });

    return NextResponse.json(
      { message: "Project created successfully", project: projectWithMembers },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Task Manager] Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

