import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/db/projects";

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

    const name = typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : undefined;

    if (!name) {
      return NextResponse.json({ error: "Project name cannot be empty" }, { status: 400 });
    }

    const updated = await updateProject(projectId, userId, name);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if ((error as any).code === "P2025") {
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
    const found = await deleteProject(projectId, userId);

    if (!found) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === "P2025") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.error("DELETE project error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
