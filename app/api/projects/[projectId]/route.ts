import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/app/generated/prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const body = await req.json().catch(() => ({}));

    // Fetch existing project to get current name if not provided in body
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject || existingProject.ownerId!== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const name = typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : undefined;
    
    if(!name) {
      return NextResponse.json({ error: "Project name cannot be empty" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: {
        id: projectId,
        ownerId: userId
      },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    //console.log(typeof error,"******@@@@@@@@@@@@@@@@@@@@@*****",  error, "******", error as Prisma.PrismaClientKnownRequestError.code );
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // If the record was not found or ownerId doesn't match, return 404 to prevent enumeration
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.error("PATCH project error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    // Using deleteMany to avoid error if record not found and for atomic check via ownerId
    const result = await prisma.project.deleteMany({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
      console.log(typeof error,"******@@@@@@@@@@@@@@@@@@@@@*****",  error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // If the record was not found or ownerId doesn't match, return 404 to prevent enumeration
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.error("DELETE project error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
