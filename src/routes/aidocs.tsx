import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, FileText, MoreHorizontal, Pin, Plus, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import { StudyDocumentIcon } from "@/components/aarth/study-material-art";
import { NotesStudioIcon } from "@/components/aarth/workspace-icons";
import { Button, EmptyState, IconButton, Pill, Spinner } from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { aiDocuments, chapters, classes, className, relativeTime, subjectsForClass } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aidocs")({
  head: () => ({
    meta: [
      { title: "AI study material — Aarth Notes AI" },
      { name: "description", content: "Generate and organise classroom-ready study material by subject and class." },
      { property: "og:title", content: "AI study material — Aarth Notes AI" },
      { property: "og:description", content: "AI-generated notes and study material for teachers." },
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
      title="Create AI study material"
      description="Choose a class and chapter. Aarth prepares a clean draft you can edit and share."
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
                toast.success("Study material saved to notes");
              }, 1200);
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
        <span className="mb-1.5 block text-xs font-semibold text-foreground">Teaching note <span className="font-normal text-muted-foreground">Optional</span></span>
        <textarea rows={4} placeholder="For example: include two solved examples and five recap questions." className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" />
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
    <AppShell title="AI Material" mobileHeader="default">
      <div className="mx-auto max-w-[1180px] space-y-5 sm:space-y-6">
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
                <NotesStudioIcon />
              </span>
              <div className="min-w-0">
                <Pill tone="tint">AI study material</Pill>
                <h1 className="display mt-3 text-[1.75rem] leading-tight text-foreground sm:text-[2.2rem]">
                  Create classroom-ready study material
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Generate chapter notes, summaries, recap questions, and lesson-ready drafts. Save them into your notes library and share with students.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialog(true)} className="h-11 w-full shrink-0 rounded-full sm:w-auto">
              <Plus className="size-4" /> Create material
            </Button>
          </div>
        </section>

        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex h-11 min-w-0 items-center gap-2.5 rounded-full border border-border bg-card px-4 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
            <Search className="size-[18px] shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search study material"
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
          <ClassSelect value={scope} onChange={setScope} />
        </div>

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
