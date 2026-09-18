import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, FileText, Plus, Search, Share2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import { Button, Card, EmptyState, IconButton, ListRow, Pill, SectionHeader } from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { NotesStudioIcon } from "@/components/aarth/workspace-icons";
import { classes, className, formatDate, libraryFiles, subjects } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes library — Aarth Notes AI" },
      {
        name: "description",
        content: "Teacher notes organised by class and subject, ready to share with students by class code.",
      },
      { property: "og:title", content: "Notes library — Aarth Notes AI" },
      { property: "og:description", content: "Organise and share teacher notes by subject and class." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notes,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

type LocalNote = {
  id: string;
  name: string;
  subjectId: string;
  size: string;
  uploadedAt: string;
  shared?: boolean;
};

function subjectFor(note: LocalNote) {
  return subjects.find((item) => item.id === note.subjectId);
}

function AddNoteDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (note: LocalNote) => void }) {
  const firstSubject = subjects[7] ?? subjects[0];
  const [title, setTitle] = useState("Laws of Motion — quick revision");
  const [subjectId, setSubjectId] = useState(firstSubject?.id ?? "");
  const [shared, setShared] = useState(true);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Create note"
      description="Add a note under a subject. Shared notes appear in the student code view."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              onAdd({
                id: `local-${Date.now()}`,
                name: title.trim() || "Untitled note",
                subjectId,
                size: "Draft",
                uploadedAt: new Date().toISOString(),
                shared,
              });
              toast.success(shared ? "Note shared with students" : "Private note saved");
              onClose();
            }}
          >
            Save note
          </Button>
        </>
      }
    >
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-foreground">Title</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} />
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject</span>
        <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className={inputClass}>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name} · {className(subject.classId)}</option>
          ))}
        </select>
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold text-foreground">Note</span>
        <textarea rows={5} placeholder="Write the key points students should revise." className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-primary/50" />
      </label>
      <label className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-muted/35 px-4 py-3">
        <span>
          <span className="block text-sm font-semibold text-foreground">Share with class</span>
          <span className="block text-xs text-muted-foreground">Students can read it using the class code.</span>
        </span>
        <input type="checkbox" checked={shared} onChange={(event) => setShared(event.target.checked)} className="size-5 accent-primary" />
      </label>
      <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
        <Upload className="mx-auto size-5 text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">Attach PDF, image, or DOCX</p>
      </div>
    </ResponsiveDialog>
  );
}

function Notes() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [upload, setUpload] = useState(false);
  const [notes, setNotes] = useState<LocalNote[]>(libraryFiles);

  const list = useMemo(
    () =>
      notes.filter((file) => {
        const subject = subjectFor(file);
        return (
          (scope === "all" || subject?.classId === scope) &&
          `${file.name} ${subject?.name ?? ""}`.toLowerCase().includes(query.toLowerCase())
        );
      }),
    [notes, query, scope],
  );

  const sharedCount = notes.filter((note) => note.shared).length;

  return (
    <AppShell title="Notes" mobileHeader="default">
      <div className="space-y-5">
        <section className="rounded-[28px] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
              <NotesStudioIcon />
            </span>
            <div className="min-w-0 flex-1">
              <Pill tone="tint">{sharedCount} shared</Pill>
              <h1 className="display mt-3 text-[1.75rem] leading-tight text-foreground sm:text-[2.2rem]">
                Notes library
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Keep uploads, board notes, and quick explanations organised by subject. Share the useful ones to students instantly.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => setUpload(true)} className="h-11 rounded-full">
              <Plus className="size-4" /> Create note
            </Button>
            <Button variant="outline" className="h-11 rounded-full" onClick={() => toast.success("Upload area ready") }>
              <Upload className="size-4" /> Upload file
            </Button>
          </div>
        </section>

        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
            <Search className="size-[18px] shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <IconButton label="Clear search" onClick={() => setQuery("")} className="size-7 rounded-full">
                <X className="size-4" />
              </IconButton>
            )}
          </label>
          <select value={scope} onChange={(event) => setScope(event.target.value)} className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground outline-none focus:border-primary/40">
            <option value="all">All classes</option>
            {classes.filter((klass) => !klass.archived).map((klass) => (
              <option key={klass.id} value={klass.id}>{klass.name}</option>
            ))}
          </select>
        </div>

        <section>
          <SectionHeader title="All notes" hint={`${list.length} files and drafts`} />
          <Card className="mt-3 overflow-hidden">
            {list.length === 0 ? (
              <EmptyState icon={<FileText className="size-5" />} title="No notes found" description="Try another class or create a note for this subject." action={<Button onClick={() => setUpload(true)}>Create note</Button>} />
            ) : (
              <div className="divide-y divide-border">
                {list.map((file) => {
                  const subject = subjectFor(file);
                  return (
                    <ListRow
                      key={file.id}
                      icon={<FileText className="size-4" />}
                      title={file.name}
                      subtitle={`${subject?.name ?? "Unassigned"} · ${subject ? className(subject.classId) : "—"} · ${formatDate(file.uploadedAt)}`}
                      trailing={
                        <div className="flex shrink-0 items-center gap-2">
                          {file.shared ? <Pill tone="tint"><Check className="size-3" /> Shared</Pill> : <Pill tone="outline">Private</Pill>}
                          <IconButton label="Copy share code" className="hidden size-9 sm:inline-flex" onClick={() => toast.success("Class code copied")}>
                            <Copy className="size-4" />
                          </IconButton>
                        </div>
                      }
                      showChevron={false}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground">
              <Share2 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Student sharing</p>
              <p className="text-xs text-muted-foreground">Shared notes appear in the class-code view.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => toast.success("Class code copied") }>
            <Copy className="size-4" /> Copy code
          </Button>
        </Card>
      </div>
      <AddNoteDialog open={upload} onClose={() => setUpload(false)} onAdd={(note) => setNotes((current) => [note, ...current])} />
    </AppShell>
  );
}
