import { SignUp } from "@clerk/nextjs";
import { Check } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Left Panel: Branding/Features (Large Screens) */}
      <div className="hidden md:flex flex-col justify-center w-1/2 bg-surface p-12 pl-24 lg:pl-32 border-r border-surface-border">
        <div className="max-w-md space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-brand tracking-tight lg:text-6xl">Ghost AI</h1>
            <p className="mt-4 text-xl leading-relaxed text-copy-secondary">
              The ultimate real-time collaborative system design workspace.
            </p>
          </div>
          <ul className="space-y-5 text-lg text-copy-primary">
            <li className="flex items-center gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-dim">
                <Check className="h-4 w-4 text-brand" />
              </span>
              Real-time collaboration
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-dim">
                <Check className="h-4 w-4 text-brand" />
              </span>
              Intuitive canvas interface
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-dim">
                <Check className="h-4 w-4 text-brand" />
              </span>
              Advanced system modeling
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel: Clerk Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-base p-6">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-brand hover:bg-brand/90 text-white",
              card: "bg-surface border border-surface-border shadow-none",
            }
          }}
        />
      </div>
    </div>
  );
}
