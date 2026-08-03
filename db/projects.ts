import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import type { Project } from "@/types/project";

type ProjectRow = Pick<
  Awaited<ReturnType<typeof prisma.project.findMany>>[number],
  "id" | "name" | "updatedAt"
>;

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    slug: slugify(row.name),
    owner: true,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createProject(userId: string, name: string): Promise<{ id: string; name: string }> {
  const project = await prisma.project.create({
    data: { ownerId: userId, name },
  });
  return { id: project.id, name: project.name };
}

export async function updateProject(
  projectId: string,
  userId: string,
  name: string
): Promise<{ id: string; name: string }> {
  const project = await prisma.project.update({
    where: { id: projectId, ownerId: userId },
    data: { name },
  });
  return { id: project.id, name: project.name };
}

export async function deleteProject(
  projectId: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.project.deleteMany({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
  return result.count > 0;
}

export async function getProjectsForUser(userId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, updatedAt: true },
  });
  return rows.map((row) => toProject(row));
}
