export interface Project {
  id: string;
  name: string;
  slug: string;
  owner: boolean;
  updatedAt: string;
}

export type ProjectOwnership = "owned" | "shared";

export interface ProjectDialogState {
  open: "create" | "rename" | "delete" | null;
  projectId: string | null;
}
