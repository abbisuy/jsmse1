import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Left Panel: Branding/Features (Large Screens) */}
      <div className="hidden md:flex flex-col justify-center w-1/2 bg-surface p-12 border-r border-surface-border">
        <div className="max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-brand tracking-tight">Ghost AI</h1>
            <p className="mt-4 text-lg text-copy-secondary">
              The ultimate real-time collaborative system design workspace.
            </p>
          </div>
          <ul className="space-y-4 text-copy-primary">
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Real-time collaboration
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Intuitive canvas interface
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
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
