import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

type ToolRoute =
  | "/quizzes"
  | "/papers"
  | "/presentations"
  | "/notes"
  | "/curriculum"
  | "/calendar"
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

function Defs({ id, tone }: { id: string; tone: number }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={wash(tone)} />
        <stop offset="100%" stopColor={ink(tone)} stopOpacity="0.35" />
      </linearGradient>
    </defs>
  );
}

function plate(tone: number, id: string) {
  return <rect x="2" y="2" width="36" height="36" rx="9" fill={`url(#${id}-g)`} />;
}

function CurriculumArt({ tone }: { tone: number }) {
  const id = "cs-curriculum";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <Defs id={id} tone={tone} />
      {plate(tone, id)}
      <circle cx="20" cy="20" r="10" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.5" />
      <path d="M20 10v10M20 20l7-4" stroke={ink(tone)} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.5" fill={warm} />
      <path d="M10 29h20" stroke={ink(tone)} strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

function QuizArt({ tone }: { tone: number }) {
  const id = "cs-quiz";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <Defs id={id} tone={tone} />
      {plate(tone, id)}
      <rect x="9" y="7" width="20" height="26" rx="3.5" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.5" />
      <rect x="15" y="4.5" width="8" height="4.5" rx="2" fill={ink(tone)} />
      <circle cx="14" cy="16" r="2.4" fill={ink(tone)} />
      <path d="M12.8 16l.9.9 1.7-1.8" stroke="var(--card)" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="19.5" y="14.5" width="6" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.35" />
      <circle cx="14" cy="23" r="2.4" fill={ink(tone)} opacity="0.18" />
      <rect x="19.5" y="21.5" width="6" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.35" />
      <circle cx="27" cy="28" r="5" fill={warm} />
      <path d="M27 25.8a1.6 1.6 0 011.3 1.4c0 .8-.5 1.1-.8 1.3-.2.2-.3.3-.3.5v.4" stroke="var(--card)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="27" cy="30.8" r="0.7" fill="var(--card)" />
    </svg>
  );
}

function PaperArt({ tone }: { tone: number }) {
  const id = "cs-paper";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <Defs id={id} tone={tone} />
      {plate(tone, id)}
      <rect x="7" y="8" width="18" height="24" rx="3" fill={ink(tone)} opacity="0.22" transform="rotate(-5 16 20)" />
      <rect x="12" y="6" width="18" height="24" rx="3" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.5" />
      <path d="M16 12.5h10M16 17h10M16 21.5h7" stroke={ink(tone)} strokeWidth="1.4" opacity="0.35" strokeLinecap="round" />
      <path d="M27 25l5-5 2 2-5 5z" fill={ink(tone)} opacity="0.9" />
      <path d="M27 25l-1 3 3-1z" fill={ink(tone)} opacity="0.6" />
    </svg>
  );
}

function SlidesArt({ tone }: { tone: number }) {
  const id = "cs-slides";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <Defs id={id} tone={tone} />
      {plate(tone, id)}
      <rect x="5.5" y="7" width="29" height="19" rx="3.5" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.5" />
      <rect x="9" y="18" width="4" height="5" rx="1" fill={ink(tone)} opacity="0.45" />
      <rect x="15" y="14" width="4" height="9" rx="1" fill={ink(tone)} />
      <rect x="21" y="16" width="4" height="7" rx="1" fill={warm} />
      <path d="M16 29h8" stroke={ink(tone)} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 25.5v3.5" stroke={ink(tone)} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="31" cy="26" r="5" fill={ink(tone)} />
      <path d="M29.5 26l3 1.5-3 1.5z" fill="var(--card)" />
    </svg>
  );
}

function ChecklistArt({ tone }: { tone: number }) {
  const id = "cs-checklist";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <Defs id={id} tone={tone} />
      {plate(tone, id)}
      <rect x="8" y="5" width="24" height="30" rx="4" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.5" />
      <circle cx="14" cy="13" r="2.4" fill={ink(tone)} />
      <path d="M12.8 13l.9.9 1.7-1.8" stroke="var(--card)" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="19.5" y="11.8" width="8" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.35" />
      <circle cx="14" cy="20.5" r="2.4" fill={ink(tone)} opacity="0.18" />
      <rect x="19.5" y="19.3" width="6" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.35" />
      <circle cx="14" cy="28" r="2.4" fill={ink(tone)} opacity="0.18" />
      <rect x="19.5" y="26.8" width="8" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.35" />
    </svg>
  );
}

function NoteArt({ tone }: { tone: number }) {
  const id = "cs-note";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <Defs id={id} tone={tone} />
      {plate(tone, id)}
      <rect x="9" y="5" width="21" height="28" rx="3" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.5" />
      <rect x="6" y="10" width="5" height="3" rx="1.5" fill={ink(tone)} />
      <rect x="6" y="18" width="5" height="3" rx="1.5" fill={warm} />
      <rect x="6" y="26" width="5" height="3" rx="1.5" fill={ink(tone)} opacity="0.5" />
      <path d="M15 13h10M15 19h10M15 25h6" stroke={ink(tone)} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <circle cx="29" cy="28" r="5" fill={ink(tone)} />
      <path d="M26.8 28.1l1.2 1.2 2.2-2.4" stroke="var(--card)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlannerArt({ tone }: { tone: number }) {
  const id = "cs-planner";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
      <Defs id={id} tone={tone} />
      {plate(tone, id)}
      <rect x="5.5" y="8" width="29" height="24" rx="3.5" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.5" />
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
    label: "Workspace tools",
    hint: "Plan your term",
    tools: [
      {
        label: "Curriculum plan",
        description: "Chapters across the year",
        to: "/curriculum",
        art: CurriculumArt,
        tone: 2,
      },
      {
        label: "Manage calendar",
        description: "Tests, dues and notices",
        to: "/calendar",
        art: PlannerArt,
        tone: 1,
      },
      {
        label: "Teaching tools",
        description: "Weekly plan, class by class",
        to: "/class-planner",
        art: ChecklistArt,
        tone: 5,
        gated: true,
      },
    ],
  },
  {
    label: "Create",
    hint: "Material for the class",
    tools: [
      {
        label: "Note",
        description: "Notes and chapter summaries",
        to: "/notes",
        art: NoteArt,
        tone: 3,
      },
      {
        label: "Presentation",
        description: "Slide deck from a chapter",
        to: "/presentations",
        art: SlidesArt,
        tone: 1,
        note: "Desktop",
      },
    ],
  },
  {
    label: "Engagement tools",
    hint: "Test what was taught",
    tools: [
      {
        label: "Quiz",
        description: "Questions with a share code",
        to: "/quizzes",
        art: QuizArt,
        tone: 4,
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
];


/* ---------- tile ---------- */

function ToolTile({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const { planEnabled } = useApp();
  const locked = Boolean(tool.gated) && !planEnabled;

  const body = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground">
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
