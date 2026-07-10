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

interface RenameProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  name: string;
  isSubmitting: boolean;
  onNameChange: (name: string) => void;
  onRename: () => void;
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  currentName,
  name,
  isSubmitting,
  onNameChange,
  onRename,
}: RenameProjectDialogProps) {
  const canRename = name.trim().length > 0 && name.trim() !== currentName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Renaming <span className="text-copy-primary">{currentName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (canRename && !isSubmitting) onRename();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rename-project-name"
              className="text-xs font-medium text-copy-muted"
            >
              Project name
            </label>
            <Input
              id="rename-project-name"
              autoFocus
              autoComplete="off"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
            />
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
            <Button type="submit" disabled={!canRename || isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
