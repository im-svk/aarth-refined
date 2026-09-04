import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
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
import { aiDocuments, presentations, quizzes, relativeTime } from "@/data/mock";
import { EmptyState } from "./primitives";

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
        description: "AI questions with a share code for students",
        to: "/quizzes",
        icon: ClipboardList,
      },
      {
        label: "Question paper",
        description: "Blueprint exam paper with a marks matrix",
        to: "/papers",
        icon: NotebookPen,
        note: "Best on desktop",
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
        description: "Slide deck generated from a chapter",
        to: "/presentations",
        icon: Presentation,
        note: "Best on desktop",
      },
      {
        label: "Assignment",
        description: "Homework, project, essay or lab report",
        to: "/assignments",
        icon: LayoutGrid,
        gated: true,
      },
      {
        label: "Note",
        description: "Upload and organise your own teaching files",
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
        description: "Map chapters across the academic year",
        to: "/curriculum",
        icon: Compass,
      },
      {
        label: "Class planner",
        description: "Weekly plan of what you teach, class by class",
        to: "/class-planner",
        icon: ListChecks,
        gated: true,
      },
    ],
  },
];

function ToolRow({
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

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-[13px]"
        style={{
          backgroundColor: `var(--ev-${tone}-bg)`,
          color: `color-mix(in oklab, var(--ev-${tone}) 76%, var(--foreground))`,
        }}
        aria-hidden
      >
        <tool.icon className="size-[18px]" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="display truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            {tool.label}
          </p>
          {tool.note && (
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/70">
              {tool.note}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[12.5px] font-medium text-muted-foreground">
          {tool.description}
        </p>
      </div>

      {locked ? (
        <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 text-[11px] font-semibold text-muted-foreground">
          <Lock className="size-3" />
          Plan
        </span>
      ) : (
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            to={tool.to}
            onClick={onClose}
            className="press inline-flex h-8 items-center rounded-full px-2.5 text-[12px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            View
          </Link>
          <Link
            to={tool.to}
            onClick={onClose}
            className="press inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Create
          </Link>
        </div>
      )}
    </div>
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

  const recents = [
    ...aiDocuments.slice(0, 2).map((d) => ({
      id: d.id,
      title: d.title,
      meta: `Study material · ${relativeTime(d.updatedAt)}`,
      to: "/aidocs" as const,
      icon: FileText,
    })),
    ...quizzes.slice(0, 1).map((q) => ({
      id: q.id,
      title: q.title,
      meta: `Quiz · ${q.questions} questions`,
      to: "/quizzes" as const,
      icon: ClipboardList,
    })),
    ...presentations.slice(0, 1).map((p) => ({
      id: p.id,
      title: p.title,
      meta: `Presentation · ${p.slides} slides`,
      to: "/presentations" as const,
      icon: Presentation,
    })),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-label="Create"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex h-[94vh] w-full flex-col overflow-hidden rounded-t-[26px] border border-border bg-background shadow-[var(--shadow-raised)]",
          "md:h-auto md:max-h-[86vh] md:max-w-2xl md:rounded-[24px]",
        )}
        style={{ animation: "sheet-up 220ms cubic-bezier(0.32,0.72,0,1)" }}
      >
        <div className="shrink-0 border-b border-border bg-card px-4 pb-3.5 pt-2.5">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border md:hidden" />
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="display text-[22px] font-semibold tracking-[-0.02em] text-foreground">
                Create
              </h2>
              <p className="mt-0.5 text-[12.5px] font-medium text-muted-foreground">
                Pick what you want to make — Aarth drafts it for your class and board.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="press -mr-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
        >
          <Link
            to="/aidocs"
            onClick={onClose}
            className="press flex items-center gap-3.5 rounded-[20px] border border-border bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-tint text-tint-foreground">
              <Sparkles className="size-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="display block text-[17px] font-semibold tracking-[-0.015em] text-foreground">
                AI study material
              </span>
              <span className="mt-0.5 block text-[12.5px] font-medium leading-relaxed text-muted-foreground">
                Notes, chapter summaries and lesson plans in an editable A4 document.
              </span>
            </span>
            <span className="press inline-flex h-9 shrink-0 items-center rounded-full bg-primary px-4 text-[12px] font-semibold text-primary-foreground">
              Create
            </span>
          </Link>

          {GROUPS.map((group) => (
            <section key={group.label} className="mt-6">
              <div className="mb-2 flex items-baseline justify-between gap-2 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {group.label}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground/70">{group.hint}</p>
              </div>
              <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-[var(--shadow-card)]">
                <div className="divide-y divide-border">
                  {group.tools.map((tool) => (
                    <ToolRow
                      key={tool.label}
                      tool={tool}
                      tone={group.tone}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}

          <section className="mt-6">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Recent
            </p>
            <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-[var(--shadow-card)]">
              {recents.length === 0 ? (
                <EmptyState
                  icon={<Sparkles className="size-5" />}
                  title="Nothing yet"
                  description="Whatever you create will show up here for quick access."
                  className="py-10"
                />
              ) : (
                <div className="divide-y divide-border">
                  {recents.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={onClose}
                      className="press flex items-center gap-3 px-4 py-3"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-muted text-muted-foreground">
                        <item.icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] font-medium text-muted-foreground">
                          {item.meta}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
