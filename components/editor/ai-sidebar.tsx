"use client";

import { useState } from "react";
import { Bot, FileText, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
];

function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border px-4">
      <div className="flex items-center gap-2.5">
        <Bot className="size-5 text-ai-text" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-copy-primary">
            AI Workspace
          </span>
          <span className="text-xs text-copy-muted">
            Collaborate with Ghost AI
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        aria-label="Close AI sidebar"
      >
        <X />
      </Button>
    </div>
  );
}

function AiArchitectTab() {
  const [value, setValue] = useState("");

  return (
    <TabsContent
      value="architect"
      className="flex flex-1 flex-col gap-3 outline-none"
    >
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-10 text-center">
          <Bot className="size-8 text-ai-text" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-copy-primary">
              Ghost AI at your service
            </p>
            <p className="text-sm text-copy-muted">
              Describe a system and Ghost AI will draft an architecture diagram
              for you.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 pt-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setValue(prompt)}
                className="rounded-full border border-surface-border bg-subtle px-3 py-1.5 text-left text-sm text-ai-text transition-colors hover:bg-subtle/80"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="flex shrink-0 flex-col gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setValue("");
            }
          }}
          placeholder="Describe a system… (Enter to send, Shift+Enter for newline)"
          className="min-h-[72px] max-h-[160px] resize-none"
        />
        <Button
          size="sm"
          className="bg-accent text-white hover:bg-accent/80"
          disabled
        >
          <Send />
          Send
        </Button>
      </div>
    </TabsContent>
  );
}

function SpecsTab() {
  return (
    <TabsContent
      value="specs"
      className="flex flex-1 flex-col gap-3 outline-none"
    >
      <Button
        size="sm"
        className="bg-accent text-white hover:bg-accent/80"
        disabled
      >
        <FileText />
        Generate Spec
      </Button>

      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="rounded-xl border border-surface-border bg-elevated p-3">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-subtle">
              <FileText className="size-4 text-ai-text" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-sm font-medium text-copy-primary">
                canvas-v2.spec.md
              </span>
              <p className="line-clamp-2 text-xs text-copy-muted">
                Defines nodes, edges, and viewport syncing behavior between
                collaborators. Includes presence, history, and shape primitives.
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] text-copy-muted">
                  Draft · 1.2 KB
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled
                  aria-label="Download spec"
                >
                  <FileText />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
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
        className={`fixed top-0 right-0 z-40 flex h-full w-80 shrink-0 flex-col rounded-xl border border-surface-border bg-base/95 shadow-sm transition-all duration-200
          md:static md:z-auto md:translate-x-0
          ${isOpen ? "translate-x-0 md:w-80" : "pointer-events-none translate-x-full md:w-0 md:overflow-hidden"}
        `}
        aria-hidden={!isOpen}
      >
        <SidebarHeader onClose={onClose} />
        <Tabs
          defaultValue="architect"
          className="flex flex-1 flex-col gap-3 overflow-hidden p-3"
        >
          <TabsList className="self-start">
            <TabsTrigger
              value="architect"
              className="data-active:bg-subtle data-active:text-ai-text"
            >
              <Bot className="size-3.5" />
              AI Architect
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="data-active:bg-subtle data-active:text-ai-text"
            >
              <FileText className="size-3.5" />
              Specs
            </TabsTrigger>
          </TabsList>
          <AiArchitectTab />
          <SpecsTab />
        </Tabs>
      </aside>
    </>
  );
}
