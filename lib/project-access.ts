import { auth, clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface CurrentUser {
  userId: string;
  email: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const email = await getUserEmail(userId);
  return { userId, email };
}

export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    );
    return primary?.emailAddress ?? null;
  } catch {
    return null;
  }
}

export type ProjectAccessResult =
  | { ok: true; project: { id: string; name: string }; role: "owner" | "collaborator" }
  | { ok: false; reason: "not-found" | "forbidden" };

interface CheckAccessDeps {
  email?: string | null;
}

export async function checkProjectAccess(
  projectId: string,
  userId: string,
  deps?: CheckAccessDeps
): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  });

  if (!project) return { ok: false, reason: "not-found" };

  if (project.ownerId === userId) {
    return { ok: true, project: { id: project.id, name: project.name }, role: "owner" };
  }

  const email = deps?.email ?? (await getUserEmail(userId));
  if (!email) return { ok: false, reason: "forbidden" };

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_collaboratorEmail: {
        projectId,
        collaboratorEmail: email,
      },
    },
    select: { id: true },
  });

  if (!collaborator) return { ok: false, reason: "forbidden" };

  return { ok: true, project: { id: project.id, name: project.name }, role: "collaborator" };
}
