"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { Button } from "@/components/ui/button";
import { useProjectsDialogs } from "@/hooks/use-projects-dialogs";
import { mockProjects } from "@/lib/mock-projects";

export function EditorHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dialogs = useProjectsDialogs();

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={mockProjects}
        onNewProject={() => {
          setIsSidebarOpen(false);
          dialogs.openCreate();
        }}
        onRename={(project) => {
          setIsSidebarOpen(false);
          dialogs.openRename(project);
        }}
        onDelete={(project) => {
          setIsSidebarOpen(false);
          dialogs.openDelete(project);
        }}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-2xl font-semibold text-copy-primary sm:text-3xl">
          Create a project or open an existing one
        </h1>
        <p className="mt-3 max-w-md text-sm text-copy-secondary">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
        <Button
          size="lg"
          className="mt-6"
          onClick={dialogs.openCreate}
        >
          <Plus />
          New Project
        </Button>
      </main>

      <CreateProjectDialog
        open={dialogs.dialog === "create"}
        onOpenChange={(open) => {
          if (!open) dialogs.close();
        }}
        name={dialogs.name}
        slug={dialogs.slug}
        isSubmitting={dialogs.isSubmitting}
        onNameChange={dialogs.setName}
        onCreate={dialogs.submitCreate}
      />

      <RenameProjectDialog
        open={dialogs.dialog === "rename"}
        onOpenChange={(open) => {
          if (!open) dialogs.close();
        }}
        currentName={dialogs.activeProject?.name ?? ""}
        name={dialogs.name}
        isSubmitting={dialogs.isSubmitting}
        onNameChange={(value) => dialogs.setName(value)}
        onRename={dialogs.submitRename}
      />

      <DeleteProjectDialog
        open={dialogs.dialog === "delete"}
        onOpenChange={(open) => {
          if (!open) dialogs.close();
        }}
        projectName={dialogs.activeProject?.name ?? ""}
        isSubmitting={dialogs.isSubmitting}
        onDelete={dialogs.submitDelete}
      />
    </div>
  );
}
