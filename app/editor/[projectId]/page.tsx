import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { getProjectsForUser } from "@/db/projects";
import { getCurrentUser, checkProjectAccess } from "@/lib/project-access";

interface EditorProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function EditorProjectPage({
  params,
}: EditorProjectPageProps) {
  const { projectId } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/sign-in");
  }

  const access = await checkProjectAccess(projectId, currentUser.userId, {
    email: currentUser.email,
  });

  if (!access.ok) {
    return <AccessDenied />;
  }

  const projects = await getProjectsForUser(currentUser.userId);

  return (
    <EditorWorkspace
      projects={projects}
      currentProject={access.project}
      isOwner={access.role === "owner"}
    />
  );
}
