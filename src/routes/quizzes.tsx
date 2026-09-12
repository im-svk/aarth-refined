import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, ClipboardList, Copy, MoreHorizontal, Plus, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import { Button, EmptyState, IconButton, Pill, Spinner } from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { chapters, classes, className, quizzes, subjectsForClass } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title: "Quizzes — Aarth Educator" },
      { name: "description", content: "Create AI quizzes from any chapter, publish a share code and track student responses." },
      { property: "og:title", content: "Quizzes — Aarth Educator" },
      { property: "og:description", content: "AI quizzes with share codes and response tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quizzes,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

const STATUS_LABEL = { draft: "Draft", published: "Published", closed: "Closed" } as const;
const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "closed", label: "Closed" },
];

function CreateQuizDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [classId, setClassId] = useState(classes[3]!.id);
  const [count, setCount] = useState(15);
  const [difficulty, setDifficulty] = useState("mixed");
  const [busy, setBusy] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Create quiz"
      description="Questions are drafted from the chapter, then you can edit each one."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={busy}
            onClick={() => {
              setBusy(true);
              setTimeout(() => {
                setBusy(false);
                onClose();
                toast.success("Quiz drafted — 15 questions");
              }, 1300);
            }}
          >
            {busy ? <><Spinner /> Drafting…</> : <><Sparkles className="size-4" /> Generate quiz</>}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Class</span>
          <select value={classId} onChange={(event) => setClassId(event.target.value)} className={inputClass}>
            {classes.filter((klass) => !klass.archived).map((klass) => (
              <option key={klass.id} value={klass.id}>{klass.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject</span>
          <select className={inputClass}>
            {subjectsForClass(classId).map((subject) => (
              <option key={subject.id}>{subject.name}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Chapter</span>
          <select className={inputClass}>
            {chapters.map((chapter) => (
              <option key={chapter.id}>{chapter.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Questions</span>
          <input
            type="number"
            value={count}
            min={5}
            max={50}
            onChange={(event) => setCount(Number(event.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Duration (minutes)</span>
          <input type="number" defaultValue={25} className={inputClass} />
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-foreground">Difficulty</p>
        <div className="flex flex-wrap gap-2">
          {["easy", "mixed", "hard"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setDifficulty(value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                difficulty === value
                  ? "border-primary/40 bg-tint text-tint-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/50",
              )}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </ResponsiveDialog>
  );
}

function StatusSelect({ value, onChange, className: cls }: { value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <label className={cn("relative block", cls)}>
      <span className="sr-only">Filter by status</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-[13px] font-medium text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
      >
        {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}

function ClassSelect({ value, onChange, className: cls }: { value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <label className={cn("relative block", cls)}>
      <span className="sr-only">Filter by class</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-[13px] font-medium text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
      >
        <option value="all">All classes</option>
        {classes.filter((item) => !item.archived).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}

function QuizIcon({ status }: { status: keyof typeof STATUS_LABEL }) {
  const tone = status === "published" ? "tint" : status === "draft" ? "outline" : "muted";
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11",
        tone === "tint" && "bg-tint text-tint-foreground",
        tone === "outline" && "bg-muted text-muted-foreground",
        tone === "muted" && "bg-muted/60 text-muted-foreground",
      )}
    >
      <ClipboardList className="size-5" />
    </div>
  );
}

function QuizRow({ quiz, last }: { quiz: (typeof quizzes)[number]; last: boolean }) {
  return (
    <div className={cn("group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50 sm:px-4", !last && "border-b border-border/70")}>
      <QuizIcon status={quiz.status} />
      <button type="button" onClick={() => toast.success(`Opening ${quiz.title}`)} className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {quiz.title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground md:hidden">
          {className(quiz.classId)} · {quiz.subject} · {quiz.questions} questions · {quiz.duration} min
        </span>
      </button>
      <span className="hidden w-36 shrink-0 truncate text-xs text-muted-foreground md:block">{className(quiz.classId)}</span>
      <span className="hidden w-24 shrink-0 truncate text-xs text-muted-foreground lg:block">{quiz.subject}</span>
      <Pill tone={quiz.status === "published" ? "tint" : "outline"} className="hidden shrink-0 sm:inline-flex">{STATUS_LABEL[quiz.status]}</Pill>
      <span className="hidden w-20 shrink-0 text-xs text-muted-foreground md:block">{quiz.questions} Qs · {quiz.duration}m</span>
      {quiz.shareCode ? (
        <button
          type="button"
          onClick={() => toast.success(`Code ${quiz.shareCode} copied`)}
          className="press hidden items-center gap-1 rounded-lg bg-muted px-2 py-1 font-mono text-[11px] font-semibold text-foreground sm:inline-flex"
        >
          {quiz.shareCode}
          <Copy className="size-3" />
        </button>
      ) : (
        <span className="hidden w-20 shrink-0 text-[11px] text-muted-foreground sm:block">No code</span>
      )}
      <IconButton label={`More options for ${quiz.title}`} className="size-9 shrink-0">
        <MoreHorizontal className="size-4" />
      </IconButton>
    </div>
  );
}

function Quizzes() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [classScope, setClassScope] = useState("all");
  const [dialog, setDialog] = useState(false);

  const list = useMemo(() =>
    quizzes.filter((quiz) =>
      (status === "all" || quiz.status === status) &&
      (classScope === "all" || quiz.classId === classScope) &&
      quiz.title.toLowerCase().includes(query.toLowerCase()),
    ), [status, classScope, query]);

  return (
    <AppShell title="Quizzes" hideHeader hideFooter>
      {/* Custom header */}
      <header className="sticky top-0 z-20 -mx-4 mb-5 flex h-14 items-center gap-2 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl md:-mx-8 md:mb-6 md:px-8">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Go back"
          className="press inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <QuizBuilderIcon />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight text-foreground">Quizzes</p>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">AI-generated tests for your classes</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] space-y-5 sm:space-y-6">
        {/* Hero card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-start gap-4 sm:items-center sm:gap-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm sm:size-14">
                <Sparkles className="size-6 sm:size-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">Create AI quizzes in minutes</h1>
                <p className="mt-0.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  Generate questions from any chapter, publish with a share code, and track responses as students submit.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialog(true)} className="h-11 w-full shrink-0 rounded-full px-4 sm:h-10 sm:w-auto">
              <Plus className="size-4" /> Create quiz
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 blur-2xl" aria-hidden="true" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-primary/[0.03] blur-3xl" aria-hidden="true" />
        </div>

        {/* Search + filter toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-full bg-muted px-4 transition-colors focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/25 sm:h-10 sm:rounded-xl sm:border sm:border-border sm:bg-card sm:focus-within:border-primary/40">
            <Search className="size-[18px] shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search quizzes"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="press inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
          <ClassSelect value={classScope} onChange={setClassScope} className="w-[132px] shrink-0 sm:w-44" />
          <StatusSelect value={status} onChange={setStatus} className="w-[132px] shrink-0 sm:w-44" />
        </div>

        {/* Recent quizzes */}
        <section aria-labelledby="quizzes-title" className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
            <h2 id="quizzes-title" className="text-sm font-semibold text-foreground">Recent quizzes</h2>
            <span className="text-xs text-muted-foreground">{list.length} {list.length === 1 ? "quiz" : "quizzes"}</span>
          </div>

          {list.length === 0 ? (
            <div className="bg-background/40 p-3 sm:p-5">
              <EmptyState icon={<ClipboardList className="size-5" />} title="No quizzes here" description="Generate a quiz from a chapter and publish it to your class with a share code." action={<Button onClick={() => setDialog(true)}>Create quiz</Button>} />
            </div>
          ) : (
            <div>
              <div className="hidden items-center gap-3 border-b border-border bg-muted/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:flex">
                <span className="flex-1">Name</span>
                <span className="w-36 shrink-0">Class</span>
                <span className="hidden w-24 shrink-0 lg:block">Subject</span>
                <span className="w-20 shrink-0">Details</span>
                <span className="w-[104px] shrink-0 xl:w-[148px]" aria-hidden="true" />
              </div>
              {list.map((quiz, index) => (
                <QuizRow key={quiz.id} quiz={quiz} last={index === list.length - 1} />
              ))}
            </div>
          )}
        </section>
      </div>

      <CreateQuizDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
