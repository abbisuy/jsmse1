import { prisma } from "@/lib/prisma";
import { getUserEmail } from "@/lib/project-access";

export async function getCollaborators(projectId: string, userId: string) {
  // Verify caller has access (owner or collaborator) before returning list
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) throw new Error("Project not found");

  const isOwner = project.ownerId === userId;
  if (!isOwner) {
    const email = await getUserEmail(userId);
    if (!email) throw new Error("Forbidden");

    const collaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_collaboratorEmail: { projectId, collaboratorEmail: email },
      },
      select: { id: true },
    });

    if (!collaborator) throw new Error("Forbidden");
  }

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, collaboratorEmail: true, createdAt: true },
  });

  return rows.map((row) => ({
    id: row.id,
    email: row.collaboratorEmail,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function addCollaborator(
  projectId: string,
  userId: string,
  email: string
) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  });

  if (!project) throw new Error("Forbidden");

  const result = await prisma.projectCollaborator.create({
    data: { projectId, collaboratorEmail: email },
    select: { id: true, collaboratorEmail: true, createdAt: true },
  });

  return {
    id: result.id,
    email: result.collaboratorEmail,
    createdAt: result.createdAt.toISOString(),
  };
}

export async function removeCollaborator(
  projectId: string,
  userId: string,
  collaboratorId: string
) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  });

  if (!project) throw new Error("Forbidden");

  const result = await prisma.projectCollaborator.deleteMany({
    where: { id: collaboratorId, projectId },
  });

  return result.count > 0;
}