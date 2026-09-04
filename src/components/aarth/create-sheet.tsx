import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Lock, X } from "lucide-react";
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

type Art = (props: { tone: number }) => React.ReactElement;

type Tool = {
  label: string;
  description: string;
  to: ToolRoute;
  art: Art;
  tone: number;
  note?: string;
  gated?: boolean;
};

type Group = { label: string; hint: string; tools: Tool[] };

/* ---------- illustrations ---------- */

const ink = (t: number) => `var(--ev-${t})`;
const wash = (t: number) => `var(--ev-${t}-bg)`;
const warm = "var(--ev-4)";

function StudyArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <rect x="8" y="5" width="20" height="27" rx="3" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.6" />
      <rect x="12" y="11" width="12" height="1.8" rx="0.9" fill={ink(tone)} opacity="0.55" />
      <rect x="12" y="16" width="9" height="1.8" rx="0.9" fill={ink(tone)} opacity="0.35" />
      <rect x="12" y="21" width="11" height="1.8" rx="0.9" fill={ink(tone)} opacity="0.35" />
      <path d="M30 14.5l1.3 3.1 3.1 1.3-3.1 1.3L30 23.3l-1.3-3.1-3.1-1.3 3.1-1.3z" fill={warm} />
      <circle cx="25.5" cy="9.5" r="2" fill={warm} opacity="0.7" />
    </svg>
  );
}

function CurriculumArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <circle cx="20" cy="19" r="13" fill={wash(tone)} stroke={ink(tone)} strokeWidth="1.6" />
      <path d="M14 25l4.5-8.5 8.5-4.5-4.5 8.5z" fill={ink(tone)} opacity="0.75" />
      <circle cx="20" cy="19" r="2.2" fill={warm} />
    </svg>
  );
}

function QuizArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <rect x="9" y="6" width="20" height="27" rx="3.5" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.6" />
      <rect x="15" y="3.5" width="8" height="4.5" rx="2" fill={ink(tone)} />
      <path d="M13.5 15l2 2 3.5-3.6" stroke={warm} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 22l2 2 3.5-3.6" stroke={ink(tone)} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="21" y="14.5" width="5" height="1.8" rx="0.9" fill={ink(tone)} opacity="0.4" />
      <rect x="21" y="21.5" width="5" height="1.8" rx="0.9" fill={ink(tone)} opacity="0.4" />
    </svg>
  );
}

function PaperArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <rect x="6.5" y="7" width="18" height="25" rx="3" fill={wash(tone)} stroke={ink(tone)} strokeWidth="1.4" opacity="0.9" />
      <rect x="12" y="4" width="20" height="27" rx="3" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.6" />
      <path d="M16 12.5h12M16 17h12M16 21.5h12" stroke={ink(tone)} strokeWidth="1.4" opacity="0.35" strokeLinecap="round" />
      <path d="M22 8.5v14M27 8.5v14" stroke={ink(tone)} strokeWidth="1.2" opacity="0.2" />
      <circle cx="28.5" cy="26" r="4" fill={warm} />
      <path d="M26.8 26.1l1.2 1.2 2-2.4" stroke="var(--card)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SlidesArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <rect x="5" y="7" width="30" height="20" rx="3" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.6" />
      <rect x="10" y="17" width="4" height="6" rx="1.2" fill={ink(tone)} opacity="0.55" />
      <rect x="16.5" y="13" width="4" height="10" rx="1.2" fill={ink(tone)} />
      <rect x="23" y="15" width="4" height="8" rx="1.2" fill={warm} />
      <path d="M16 31h8" stroke={ink(tone)} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 27v4" stroke={ink(tone)} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AssignmentArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <path d="M5 12a3 3 0 013-3h7l2.6 3H32a3 3 0 013 3v14a3 3 0 01-3 3H8a3 3 0 01-3-3z" fill={wash(tone)} stroke={ink(tone)} strokeWidth="1.6" />
      <rect x="11" y="15" width="18" height="9" rx="2" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.3" />
      <path d="M14.5 19.5h8" stroke={ink(tone)} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <circle cx="27" cy="13" r="3.2" fill={warm} />
    </svg>
  );
}

function NoteArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <rect x="9" y="5" width="21" height="28" rx="3" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.6" />
      <rect x="6" y="10" width="5" height="3" rx="1.5" fill={ink(tone)} />
      <rect x="6" y="18" width="5" height="3" rx="1.5" fill={warm} />
      <rect x="6" y="26" width="5" height="3" rx="1.5" fill={ink(tone)} opacity="0.5" />
      <path d="M15 13h10M15 19h10M15 25h6" stroke={ink(tone)} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

function PlannerArt({ tone }: { tone: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <rect x="5.5" y="8" width="29" height="24" rx="3.5" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.6" />
      <path d="M5.5 14.5h29" stroke={ink(tone)} strokeWidth="1.4" />
      <path d="M13 5.5v5M27 5.5v5" stroke={ink(tone)} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="9.5" y="18" width="6" height="4" rx="1.3" fill={ink(tone)} opacity="0.35" />
      <rect x="17" y="18" width="6" height="4" rx="1.3" fill={warm} />
      <rect x="24.5" y="18" width="6" height="4" rx="1.3" fill={ink(tone)} opacity="0.35" />
      <rect x="9.5" y="24.5" width="13.5" height="4" rx="1.3" fill={ink(tone)} opacity="0.6" />
    </svg>
  );
}

/* ---------- data ---------- */

const GROUPS: Group[] = [
  {
    label: "AI study tools",
    hint: "Aarth writes the first draft",
    tools: [
      {
        label: "Study material",
        description: "Notes and chapter summaries",
        to: "/aidocs",
        art: StudyArt,
        tone: 1,
      },
      {
        label: "Curriculum plan",
        description: "Chapters across the year",
        to: "/curriculum",
        art: CurriculumArt,
        tone: 2,
      },
    ],
  },
  {
    label: "Assessments",
    hint: "Test what was taught",
    tools: [
      {
        label: "Quiz",
        description: "Questions with a share code",
        to: "/quizzes",
        art: QuizArt,
        tone: 3,
      },
      {
        label: "Question paper",
        description: "Blueprint with marks matrix",
        to: "/papers",
        art: PaperArt,
        tone: 5,
        note: "Desktop",
      },
    ],
  },
  {
    label: "Class materials",
    hint: "For the classroom",
    tools: [
      {
        label: "Presentation",
        description: "Slide deck from a chapter",
        to: "/presentations",
        art: SlidesArt,
        tone: 1,
        note: "Desktop",
      },
      {
        label: "Assignment",
        description: "Homework or lab report",
        to: "/assignments",
        art: AssignmentArt,
        tone: 4,
        gated: true,
      },
      {
        label: "Note",
        description: "Upload your own files",
        to: "/notes",
        art: NoteArt,
        tone: 3,
      },
    ],
  },
  {
    label: "Planning",
    hint: "Ahead of the week",
    tools: [
      {
        label: "Class planner",
        description: "Weekly, class by class",
        to: "/class-planner",
        art: PlannerArt,
        tone: 2,
        gated: true,
      },
    ],
  },
];

/* ---------- tile ---------- */

function ToolTile({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const { planEnabled } = useApp();
  const locked = Boolean(tool.gated) && !planEnabled;

  const body = (
    <>
      <span
        className="flex size-[52px] shrink-0 items-center justify-center rounded-[18px]"
        style={{ backgroundColor: `var(--ev-${tool.tone}-bg)` }}
      >
        <tool.art tone={tool.tone} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="display text-[16px] font-semibold leading-tight tracking-[-0.015em] text-foreground">
            {tool.label}
          </p>
          {tool.note && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/80">
              {tool.note}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[13px] font-medium leading-snug text-muted-foreground">
          {tool.description}
        </p>
      </div>

      {locked ? (
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Lock className="size-3.5" />
        </span>
      ) : (
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight className="size-4" />
        </span>
      )}
    </>
  );

  const shell =
    "group flex items-center gap-3.5 rounded-[22px] border border-border bg-card p-3 text-left shadow-[var(--shadow-card)]";

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

/* ---------- sheet ---------- */

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
          className="flex-1 overflow-y-auto px-5 pt-2"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.75rem)" }}
        >
          {GROUPS.map((group) => (
            <section key={group.label} className="mt-5 first:mt-1">
              <div className="mb-2.5 flex items-baseline justify-between gap-2 px-0.5">
                <p className="display text-[13px] font-semibold tracking-[-0.01em] text-foreground">
                  {group.label}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground/70">{group.hint}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
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
