import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EditorHome } from "@/components/editor/editor-home";
import { getProjectsForUser } from "@/db/projects";

export default async function EditorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const projects = await getProjectsForUser(userId);
  return <EditorHome projects={projects} />;
}
