import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, FileText, MoreHorizontal, Pin, Plus, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import { StudyDocumentIcon } from "@/components/aarth/study-material-art";
import { Button, EmptyState, IconButton, Pill, Spinner } from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { aiDocuments, chapters, classes, className, relativeTime, subjectsForClass } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aidocs")({
  head: () => ({
    meta: [
      { title: "AI Study Material — Aarth Educator" },
      { name: "description", content: "Create and organise editable, textbook-aligned teaching material." },
      { property: "og:title", content: "AI Study Material — Aarth Educator" },
      { property: "og:description", content: "Create and organise editable, textbook-aligned teaching material." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyMaterial,
});

const TEMPLATE_LABEL: Record<string, string> = {
  blank: "Blank document",
  question_paper: "Question paper",
  study_material: "Study notes",
  lesson_plan: "Lesson plan",
  report: "Report",
};

const TEMPLATE_TONE: Record<string, 1 | 2 | 3 | 4> = {
  blank: 1,
  study_material: 1,
  lesson_plan: 2,
  question_paper: 3,
  report: 4,
};

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10";

function GenerateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const initialClass = classes.find((item) => !item.archived);
  const initialChapter = chapters[0];
  const [classId, setClassId] = useState(initialClass?.id ?? "");
  const availableSubjects = subjectsForClass(classId);
  const [subject, setSubject] = useState(availableSubjects[0]?.name ?? "Science");
  const [chapter, setChapter] = useState(initialChapter?.name ?? "");
  const [template, setTemplate] = useState("study_material");
  const [depth, setDepth] = useState("standard");
  const [generating, setGenerating] = useState(false);

  const chooseClass = (nextClassId: string) => {
    setClassId(nextClassId);
    setSubject(subjectsForClass(nextClassId)[0]?.name ?? "");
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Create study material"
      description="Choose the class and chapter. Aarth will prepare an editable first draft."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={generating}
            onClick={() => {
              setGenerating(true);
              setTimeout(() => {
                setGenerating(false);
                onClose();
                toast.success("Your material is ready to edit");
              }, 1400);
            }}
          >
            {generating ? <><Spinner className="text-primary-foreground" /> Creating…</> : <><Sparkles className="size-4" /> Create draft</>}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Class</span>
          <select value={classId} onChange={(event) => chooseClass(event.target.value)} className={inputClass}>
            {classes.filter((item) => !item.archived).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)} className={inputClass}>
            {availableSubjects.map((item) => <option key={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Chapter</span>
          <select value={chapter} onChange={(event) => setChapter(event.target.value)} className={inputClass}>
            {chapters.map((item) => <option key={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-xs font-semibold text-foreground">What do you want to create?</legend>
        <div className="grid grid-cols-2 gap-2">
          {["study_material", "lesson_plan", "report", "blank"].map((value) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              onClick={() => setTemplate(value)}
              className={cn("h-auto min-h-11 justify-start px-3 py-2.5 text-left", template === value && "border-primary/40 bg-tint text-tint-foreground")}
            >
              {TEMPLATE_LABEL[value]}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="mb-2 text-xs font-semibold text-foreground">Level of detail</legend>
        <div className="grid grid-cols-3 rounded-xl border border-border bg-muted/50 p-1">
          {["brief", "standard", "detailed"].map((value) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDepth(value)}
              className={cn("capitalize", depth === value && "bg-card text-foreground shadow-[var(--shadow-card)]")}
            >
              {value}
            </Button>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-xs font-semibold text-foreground">Anything else? <span className="font-normal text-muted-foreground">Optional</span></span>
        <textarea rows={3} placeholder="For example: add five recap questions at the end." className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
      </label>
    </ResponsiveDialog>
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

function DocumentRow({ doc, last }: { doc: (typeof aiDocuments)[number]; last: boolean }) {
  return (
    <div className={cn("group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50 sm:px-4", !last && "border-b border-border/70")}>
      <StudyDocumentIcon tone={TEMPLATE_TONE[doc.template] ?? 1} />
      <button type="button" onClick={() => toast.success(`Opening ${doc.title}`)} className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {doc.pinned && <Pin className="mr-1.5 inline-block size-3.5 -translate-y-px text-primary" fill="currentColor" aria-label="Pinned" />}
          {doc.title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground md:hidden">
          {className(doc.classId)} · {doc.subject} · Edited {relativeTime(doc.updatedAt)}
        </span>
      </button>
      <span className="hidden w-36 shrink-0 truncate text-xs text-muted-foreground md:block">{className(doc.classId)}</span>
      <span className="hidden w-24 shrink-0 truncate text-xs text-muted-foreground lg:block">{doc.subject}</span>
      <span className="hidden w-32 shrink-0 text-xs text-muted-foreground md:block">{relativeTime(doc.updatedAt)}</span>
      <Pill tone="outline" className="hidden shrink-0 sm:inline-flex">{TEMPLATE_LABEL[doc.template]}</Pill>
      <IconButton label={`More options for ${doc.title}`} className="size-9 shrink-0">
        <MoreHorizontal className="size-4" />
      </IconButton>
    </div>
  );
}

function StudyMaterial() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [dialog, setDialog] = useState(false);

  const docs = useMemo(() => aiDocuments.filter((doc) =>
    (scope === "all" || doc.classId === scope) &&
    `${doc.title} ${doc.subject}`.toLowerCase().includes(query.toLowerCase()),
  ), [query, scope]);
  const pinned = docs.find((doc) => doc.pinned);
  const documents = pinned ? [pinned, ...docs.filter((doc) => doc.id !== pinned.id)] : docs;

  return (
    <AppShell title="Study Material" wide hideHeader hideFooter>
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
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-tint text-tint-foreground">
            <FileText className="size-4" />
          </span>
          <span className="truncate text-[15px] font-semibold text-foreground">Study material</span>
        </div>
        <Button onClick={() => setDialog(true)} className="h-9 gap-1.5 rounded-full px-3.5 text-xs">
          <Plus className="size-4" /> New
        </Button>
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
                <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  Create classroom-ready study material
                </h1>
                <p className="mt-0.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  Generate AI-drafted notes, question papers and lesson plans aligned to your syllabus. Edit, pin and share with your class.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialog(true)} className="h-11 w-full shrink-0 rounded-full px-4 sm:h-10 sm:w-auto">
              <Plus className="size-4" /> New material
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
              placeholder="Search in study material"
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
          <ClassSelect value={scope} onChange={setScope} className="w-[132px] shrink-0 sm:w-44" />
        </div>

        {/* Recent documents */}
        <section aria-labelledby="documents-title" className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
            <h2 id="documents-title" className="text-sm font-semibold text-foreground">Recent</h2>
            <span className="text-xs text-muted-foreground">{docs.length} {docs.length === 1 ? "document" : "documents"}</span>
          </div>

          {documents.length === 0 ? (
            <div className="bg-background/40 p-3 sm:p-5">
              <EmptyState icon={<FileText className="size-5" />} title="No matching documents" description="Try another search or class, or create a new document." action={<Button onClick={() => setDialog(true)}>Create material</Button>} />
            </div>
          ) : (
            <div>
              <div className="hidden items-center gap-3 border-b border-border bg-muted/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:flex">
                <span className="flex-1">Name</span>
                <span className="w-36 shrink-0">Class</span>
                <span className="hidden w-24 shrink-0 lg:block">Subject</span>
                <span className="w-32 shrink-0">Last edited</span>
                <span className="w-[104px] shrink-0 xl:w-[148px]" aria-hidden="true" />
              </div>
              {documents.map((doc, index) => (
                <DocumentRow key={doc.id} doc={doc} last={index === documents.length - 1} />
              ))}
            </div>
          )}
        </section>
      </div>
      <GenerateDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
