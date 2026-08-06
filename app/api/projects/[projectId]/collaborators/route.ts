import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  getCollaborators,
  addCollaborator,
  removeCollaborator,
} from "@/db/collaborators";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const collaborators = await getCollaborators(projectId, userId);

    // Enrich with Clerk user data (display name + avatar)
    let enriched = collaborators;
    try {
      const client = await clerkClient();
      const emails = collaborators.map((c) => c.email);
      const clerkUsers = await client.users.getUserList({
        emailAddress: emails,
      });
      const emailMap = new Map<string, { displayName: string; avatarUrl: string }>();
      for (const user of clerkUsers.data) {
        const primary = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId
        );
        if (!primary) continue;
        emailMap.set(primary.emailAddress, {
          displayName:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName ?? user.username ?? primary.emailAddress,
          avatarUrl: user.imageUrl,
        });
      }
      enriched = collaborators.map((c) => ({
        ...c,
        displayName: emailMap.get(c.email)?.displayName ?? null,
        avatarUrl: emailMap.get(c.email)?.avatarUrl ?? null,
      }));
    } catch {
      // Clerk enrichment failed — fall back to email-only
    }

    return NextResponse.json({ collaborators: enriched });
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Project not found") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.error("GET collaborators error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const body = await req.json().catch(() => ({}));
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  try {
    const collaborator = await addCollaborator(projectId, userId, email);
    return NextResponse.json(collaborator, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Collaborator already exists" },
        { status: 409 }
      );
    }
    console.error("POST collaborator error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const body = await req.json().catch(() => ({}));
  const collaboratorId =
    typeof body.collaboratorId === "string" ? body.collaboratorId : "";

  if (!collaboratorId) {
    return NextResponse.json(
      { error: "collaboratorId is required" },
      { status: 400 }
    );
  }

  try {
    const removed = await removeCollaborator(projectId, userId, collaboratorId);
    if (!removed) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("DELETE collaborator error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}