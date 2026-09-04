import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ClipboardList,
  Compass,
  FileText,
  LayoutGrid,
  ListChecks,
  Lock,
  NotebookPen,
  Presentation,
  Sparkles,
  StickyNote,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

type ToolRoute =
  | "/aidocs"
  | "/quizzes"
  | "/papers"
  | "/presentations"
  | "/assignments"
  | "/notes"
  | "/curriculum"
  | "/class-planner";

type Tool = {
  label: string;
  description: string;
  to: ToolRoute;
  icon: typeof FileText;
  note?: string;
  gated?: boolean;
};

type Group = { label: string; hint: string; tone: number; tools: Tool[] };

const GROUPS: Group[] = [
  {
    label: "Assessments",
    hint: "Test what was taught",
    tone: 3,
    tools: [
      {
        label: "Quiz",
        description: "Questions with a share code",
        to: "/quizzes",
        icon: ClipboardList,
      },
      {
        label: "Question paper",
        description: "Blueprint with marks matrix",
        to: "/papers",
        icon: NotebookPen,
        note: "Desktop",
      },
    ],
  },
  {
    label: "Class materials",
    hint: "For the classroom",
    tone: 1,
    tools: [
      {
        label: "Presentation",
        description: "Slide deck from a chapter",
        to: "/presentations",
        icon: Presentation,
        note: "Desktop",
      },
      {
        label: "Assignment",
        description: "Homework or lab report",
        to: "/assignments",
        icon: LayoutGrid,
        gated: true,
      },
      {
        label: "Note",
        description: "Upload your own files",
        to: "/notes",
        icon: StickyNote,
      },
    ],
  },
  {
    label: "Planning",
    hint: "Ahead of the term",
    tone: 2,
    tools: [
      {
        label: "Curriculum plan",
        description: "Chapters across the year",
        to: "/curriculum",
        icon: Compass,
      },
      {
        label: "Class planner",
        description: "Weekly, class by class",
        to: "/class-planner",
        icon: ListChecks,
        gated: true,
      },
    ],
  },
];

function ToolTile({
  tool,
  tone,
  onClose,
}: {
  tool: Tool;
  tone: number;
  onClose: () => void;
}) {
  const { planEnabled } = useApp();
  const locked = Boolean(tool.gated) && !planEnabled;

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-[15px]"
          style={{
            backgroundColor: `var(--ev-${tone}-bg)`,
            color: `color-mix(in oklab, var(--ev-${tone}) 76%, var(--foreground))`,
          }}
          aria-hidden
        >
          <tool.icon className="size-5" />
        </span>
        {locked ? (
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Lock className="size-3.5" />
          </span>
        ) : (
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-4" />
          </span>
        )}
      </div>

      <div className="mt-3.5">
        <p className="display text-[15px] font-semibold leading-tight tracking-[-0.015em] text-foreground">
          {tool.label}
        </p>
        <p className="mt-1 text-[12px] font-medium leading-snug text-muted-foreground">
          {tool.description}
        </p>
      </div>

      {tool.note && (
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
          {tool.note}
        </p>
      )}
    </>
  );

  const shell =
    "group relative flex min-h-[132px] flex-col rounded-[20px] border border-border bg-card p-3.5 text-left shadow-[var(--shadow-card)]";

  if (locked) {
    return (
      <div className={cn(shell, "opacity-70")} aria-disabled>
        {body}
      </div>
    );
  }

  return (
    <Link to={tool.to} onClick={onClose} className={cn(shell, "press")}>
      {body}
    </Link>
  );
}

export function CreateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-border bg-background shadow-[var(--shadow-raised)]",
          "md:h-auto md:max-h-[86vh] md:max-w-3xl md:rounded-[26px]",
        )}
        style={{ animation: "sheet-up 260ms cubic-bezier(0.32,0.72,0,1)" }}
      >
        <div className="shrink-0 bg-card px-5 pb-4 pt-2.5">
          <div className="mx-auto mb-3.5 h-1.5 w-10 rounded-full bg-border md:hidden" />
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="display text-[24px] font-semibold leading-tight tracking-[-0.025em] text-foreground">
                Create
              </h2>
              <p className="mt-1 text-[12.5px] font-medium text-muted-foreground">
                Aarth drafts it for your class, board and chapter.
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
          className="flex-1 overflow-y-auto px-5 pb-6 pt-1"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.75rem)" }}
        >
          <Link
            to="/aidocs"
            onClick={onClose}
            className="press group relative flex flex-col overflow-hidden rounded-[24px] border border-primary/20 bg-tint p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-[17px] bg-primary text-primary-foreground">
                <Sparkles className="size-6" />
              </span>
              <span className="inline-flex items-center rounded-full bg-card/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-tint-foreground">
                Most used
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="min-w-0">
                <span className="display block text-[19px] font-semibold leading-tight tracking-[-0.02em] text-tint-foreground">
                  AI study material
                </span>
                <span className="mt-1 block text-[12.5px] font-medium leading-snug text-tint-foreground/75">
                  Notes, chapter summaries and lesson plans in an editable A4 document.
                </span>
              </span>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>

          {GROUPS.map((group) => (
            <section key={group.label} className="mt-7">
              <div className="mb-2.5 flex items-baseline justify-between gap-2 px-0.5">
                <p className="display text-[13px] font-semibold tracking-[-0.01em] text-foreground">
                  {group.label}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground/70">{group.hint}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolTile
                    key={tool.label}
                    tool={tool}
                    tone={group.tone}
                    onClose={onClose}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
