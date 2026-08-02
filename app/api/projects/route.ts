import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createProject, getProjectsForUser } from "@/db/projects";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await getProjectsForUser(userId);
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name =
    typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Untitled Project";

  const project = await createProject(userId, name);
  return NextResponse.json(project, { status: 201 });
}
