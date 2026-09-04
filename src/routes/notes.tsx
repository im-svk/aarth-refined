import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, StickyNote, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  FilterChips,
  IconButton,
  ListRow,
  PageHeader,
  Pill,
  SearchField,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { classes, className, formatDate, libraryFiles, subjects } from "@/data/mock";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Aarth Educator" },
      {
        name: "description",
        content: "Your own teaching notes and uploads, organised by class and subject.",
      },
      { property: "og:title", content: "Notes — Aarth Educator" },
      { property: "og:description", content: "Teaching notes and uploads, per subject." },
    ],
  }),
  component: Notes,
});

function Notes() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [upload, setUpload] = useState(false);

  const list = useMemo(
    () =>
      libraryFiles.filter((file) => {
        const subject = subjects.find((item) => item.id === file.subjectId);
        return (
          (scope === "all" || subject?.classId === scope) &&
          file.name.toLowerCase().includes(query.toLowerCase())
        );
      }),
    [query, scope],
  );

  return (
    <AppShell title="Notes">
      <div className="space-y-6">
        <PageHeader
          kicker="Class materials"
          title="Notes"
          subtitle="Files you keep for yourself or share with a module — worksheets, references, handwritten scans."
          actions={
            <Button onClick={() => setUpload(true)}>
              <Upload className="size-4" /> Add note
            </Button>
          }
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search notes"
            className="lg:w-80"
          />
          <FilterChips
            value={scope}
            onChange={setScope}
            className="lg:ml-auto"
            options={[
              { value: "all", label: "All classes" },
              ...classes
                .filter((klass) => !klass.archived)
                .map((klass) => ({
                  value: klass.id,
                  label: klass.name.replace("Class ", "Cl. "),
                })),
            ]}
          />
        </div>

        <Card>
          {list.length === 0 ? (
            <EmptyState
              icon={<StickyNote className="size-5" />}
              title="No notes yet"
              description="Add a note or upload a file and tag it to a subject so it's easy to find later."
              action={
                <Button onClick={() => setUpload(true)}>
                  <Upload className="size-4" /> Add note
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {list.map((file) => {
                const subject = subjects.find((item) => item.id === file.subjectId);
                return (
                  <ListRow
                    key={file.id}
                    icon={<StickyNote className="size-4" />}
                    title={file.name}
                    subtitle={`${subject?.name ?? "Unassigned"} · ${subject ? className(subject.classId) : "—"} · ${formatDate(file.uploadedAt)}`}
                    showChevron={false}
                    trailing={
                      <div className="flex items-center gap-2">
                        {file.shared && <Pill tone="tint">Shared</Pill>}
                        <IconButton label="Download" onClick={() => toast.success("Downloading")}>
                          <Download className="size-4" />
                        </IconButton>
                        <IconButton label="Delete" onClick={() => toast.success("Note deleted")}>
                          <Trash2 className="size-4" />
                        </IconButton>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <ResponsiveDialog
        open={upload}
        onClose={() => setUpload(false)}
        title="Add note"
        description="Attach a file, or write a short note against a subject."
        footer={
          <>
            <Button variant="ghost" onClick={() => setUpload(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setUpload(false);
                toast.success("Note added");
              }}
            >
              Save note
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Title</span>
          <input
            placeholder="Friction — board work"
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary/50"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject</span>
          <select className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary/50">
            {subjects.slice(0, 8).map((subject) => (
              <option key={subject.id}>
                {subject.name} · {className(subject.classId)}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Note</span>
          <textarea
            rows={4}
            placeholder="Recap the free-body diagram before starting circular motion."
            className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary/50"
          />
        </label>
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">Or drop a file here (PDF, image, DOCX)</p>
        </div>
      </ResponsiveDialog>
    </AppShell>
  );
}
