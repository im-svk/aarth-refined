import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, MoreHorizontal, Pin, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import { StudyDocumentIcon, StudyMaterialHeroArt } from "@/components/aarth/study-material-art";
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
  const [searchOpen, setSearchOpen] = useState(false);

  const docs = useMemo(() => aiDocuments.filter((doc) =>
    (scope === "all" || doc.classId === scope) &&
    `${doc.title} ${doc.subject}`.toLowerCase().includes(query.toLowerCase()),
  ), [query, scope]);
  const pinned = docs.find((doc) => doc.pinned);
  const documents = pinned ? [pinned, ...docs.filter((doc) => doc.id !== pinned.id)] : docs;

  return (
    <AppShell title="Study Material" wide mobileHeader="study" back hideFooter>
      <div className="aidocs-workspace mx-auto max-w-[1180px] space-y-5 [font-family:'DM_Sans',sans-serif] sm:space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-aidocs-line bg-card shadow-[var(--shadow-card)]">
          <div className="grid min-h-[150px] grid-cols-1 items-center md:grid-cols-[minmax(0,1fr)_180px]">
            <div className="relative z-10 p-5 sm:p-6">
              <h1 className="max-w-md text-xl font-semibold leading-snug text-foreground [font-family:'Space_Grotesk',sans-serif] sm:text-2xl">
                Create classroom-ready study material.
              </h1>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Notes, summaries and lesson plans from any chapter.
              </p>
              <Button size="sm" onClick={() => setDialog(true)} className="mt-4">
                <Sparkles className="size-3.5" /> Create material
              </Button>
            </div>
            <div className="absolute -right-6 -top-4 w-36 opacity-30 sm:-right-2 sm:w-40 md:static md:flex md:w-auto md:items-center md:justify-center md:p-5 md:opacity-100">
              <StudyMaterialHeroArt />
            </div>
          </div>
        </section>

        <section aria-labelledby="documents-title" className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border p-4 sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 id="documents-title" className="text-base font-semibold text-foreground [font-family:'Space_Grotesk',sans-serif]">Recent</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{docs.length} {docs.length === 1 ? "document" : "documents"}</p>
              </div>
              <Button size="sm" onClick={() => setDialog(true)} className="hidden sm:inline-flex"><Sparkles className="size-3.5" /> New</Button>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px]">
              <label className="flex h-11 items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3 focus-within:border-primary/50 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/10">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, chapter or subject" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
              </label>
              <label className="relative">
                <span className="sr-only">Filter by class</span>
                <select value={scope} onChange={(event) => setScope(event.target.value)} className={`${inputClass} appearance-none pr-9`}>
                  <option value="all">All classes</option>
                  {classes.filter((item) => !item.archived).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
            </div>
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

        <div className="hidden justify-end sm:flex">
          <Button variant="danger" size="sm" onClick={() => toast.success("Select a document to remove it")}><Trash2 className="size-3.5" /> Manage documents</Button>
        </div>
      </div>
      <GenerateDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}