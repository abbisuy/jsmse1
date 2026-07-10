"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  slug: string;
  isSubmitting: boolean;
  onNameChange: (name: string) => void;
  onCreate: () => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  slug,
  isSubmitting,
  onNameChange,
  onCreate,
}: CreateProjectDialogProps) {
  const canCreate = name.trim().length > 0 && slug.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Name your new architecture workspace.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (canCreate && !isSubmitting) onCreate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-project-name"
              className="text-xs font-medium text-copy-muted"
            >
              Project name
            </label>
            <Input
              id="create-project-name"
              autoFocus
              autoComplete="off"
              placeholder="My architecture"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-copy-muted">Slug</span>
            <div className="rounded-lg border border-surface-border bg-base px-2.5 py-1.5 text-sm text-copy-secondary">
              {slug || "my-architecture"}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canCreate || isSubmitting}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
