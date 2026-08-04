import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-dim">
        <Lock className="h-6 w-6 text-brand" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-copy-primary">
          Access denied
        </h1>
        <p className="max-w-sm text-sm text-copy-secondary">
          You don't have access to this project, or it no longer exists.
        </p>
      </div>
      <Link href="/editor">
        <Button variant="outline" size="lg">Back to editor</Button>
      </Link>
    </div>
  );
}
