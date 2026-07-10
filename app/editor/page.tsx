import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EditorHome } from "@/components/editor/editor-home";

export default async function EditorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <EditorHome />;
}
