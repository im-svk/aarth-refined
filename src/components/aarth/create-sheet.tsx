import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotesStudioIcon } from "./workspace-icons";

type ToolRoute = "/notes" | "/aidocs" | "/student-view";

type Tool = {
  label: string;
  description: string;
  to: ToolRoute;
  art: React.ReactElement;
};

type Group = { label: string; hint: string; tools: Tool[] };

function StudyMaterialArt() {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <defs>
        <linearGradient id="cs-ai-material" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ev-2-bg)" />
          <stop offset="100%" stopColor="var(--ev-2)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="9" fill="url(#cs-ai-material)" />
      <rect x="8" y="8" width="19" height="24" rx="3" fill="var(--card)" stroke="var(--ev-2)" strokeWidth="1.4" />
      <path d="M13 15h10M13 20h8M13 25h10" stroke="var(--ev-2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <circle cx="28" cy="27" r="6" fill="var(--ev-2)" />
      <path d="m28 23.5.9 2.6h2.6l-2.1 1.5.8 2.6-2.2-1.6-2.2 1.6.8-2.6-2.1-1.5h2.6z" fill="var(--card)" />
      <circle cx="29" cy="11" r="4" fill="var(--ev-4)" />
    </svg>
  );
}

function ShareCodeArt() {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <defs>
        <linearGradient id="cs-share-code" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ev-3-bg)" />
          <stop offset="100%" stopColor="var(--ev-3)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="9" fill="url(#cs-share-code)" />
      <rect x="8" y="11" width="24" height="18" rx="5" fill="var(--card)" stroke="var(--ev-3)" strokeWidth="1.4" />
      <path d="M13 20h14" stroke="var(--ev-3)" strokeWidth="1.8" strokeLinecap="round" opacity="0.3" />
      <circle cx="13" cy="20" r="3" fill="var(--ev-3)" />
      <circle cx="27" cy="14" r="3" fill="var(--ev-4)" />
      <circle cx="27" cy="26" r="3" fill="var(--ev-3)" opacity="0.55" />
      <path d="M15.7 18.7 24.4 15.3M15.7 21.3 24.4 24.7" stroke="var(--ev-3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const GROUPS: Group[] = [
  {
    label: "Create",
    hint: "Teacher material",
    tools: [
      {
        label: "Note",
        description: "Write or upload notes by subject",
        to: "/notes",
        art: <NotesStudioIcon />,
      },
      {
        label: "AI study material",
        description: "Generate a clean draft for class",
        to: "/aidocs",
        art: <StudyMaterialArt />,
      },
    ],
  },
  {
    label: "Share",
    hint: "For students",
    tools: [
      {
        label: "Class code",
        description: "Copy the code students use to view notes",
        to: "/student-view",
        art: <ShareCodeArt />,
      },
    ],
  },
];

function ToolTile({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  return (
    <Link
      to={tool.to}
      onClick={onClose}
      className="group press flex items-center gap-3.5 rounded-[22px] border border-border bg-card p-3 text-left shadow-[var(--shadow-card)]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground">
        {tool.art}
      </span>

      <div className="min-w-0 flex-1">
        <p className="display text-[16px] font-semibold leading-tight text-foreground">{tool.label}</p>
        <p className="mt-0.5 text-[13px] font-medium leading-snug text-muted-foreground">
          {tool.description}
        </p>
      </div>

      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}

export function CreateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/45 backdrop-blur-[3px] md:items-center md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-label="Create"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "flex h-[72vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-border bg-background shadow-[var(--shadow-raised)]",
          "md:h-auto md:max-h-[86vh] md:max-w-2xl md:rounded-[26px]",
        )}
        style={{ animation: "sheet-up 260ms cubic-bezier(0.32,0.72,0,1)" }}
      >
        <div className="shrink-0 bg-card px-5 pb-4 pt-2.5">
          <div className="mx-auto mb-3.5 h-1.5 w-10 rounded-full bg-border md:hidden" />
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="display text-[24px] font-semibold leading-tight text-foreground">Create</h2>
              <p className="mt-1 text-[12.5px] font-medium text-muted-foreground">
                Make notes, AI study material, or share a class code.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="press -mr-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-5 pt-2"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.75rem)" }}
        >
          {GROUPS.map((group) => (
            <section key={group.label} className="mt-5 first:mt-1">
              <div className="mb-2.5 flex items-baseline justify-between gap-2 px-0.5">
                <p className="display text-[13px] font-semibold text-foreground">{group.label}</p>
                <p className="text-[11px] font-medium text-muted-foreground/70">{group.hint}</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {group.tools.map((tool) => (
                  <ToolTile key={tool.label} tool={tool} onClose={onClose} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
