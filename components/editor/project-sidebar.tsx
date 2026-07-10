"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectItem } from "@/components/editor/project-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Project } from "@/types/project";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onNewProject: () => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function EmptyPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <p className="text-center text-sm text-copy-muted">{label}</p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onNewProject,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  const owned = projects.filter((p) => p.owner);
  const shared = projects.filter((p) => !p.owner);

  return (
    <>
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 z-40 flex h-full w-72 flex-col border-r border-surface-border bg-surface transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border px-4">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex flex-1 flex-col gap-2 overflow-hidden p-3"
        >
          <TabsList className="self-start">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex flex-1 flex-col">
            {owned.length === 0 ? (
              <EmptyPlaceholder label="No projects yet" />
            ) : (
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-0.5 pr-2">
                  {owned.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          <TabsContent value="shared" className="flex flex-1 flex-col">
            {shared.length === 0 ? (
              <EmptyPlaceholder label="Nothing shared with you" />
            ) : (
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-0.5 pr-2">
                  {shared.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-surface-border p-3">
          <Button className="w-full" size="lg" onClick={onNewProject}>
            <Plus />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
