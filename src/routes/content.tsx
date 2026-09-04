import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download, FileText, Library, Plus, Upload } from "lucide-react";
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
  SegmentedToggle,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import {
  classes,
  className,
  formatDate,
  libraryFiles,
  subjects,
  textbooks,
} from "@/data/mock";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Library — Aarth Educator" },
      {
        name: "description",
        content:
          "Institution teaching library: uploaded files per subject plus NCERT and Karnataka State textbooks.",
      },
      { property: "og:title", content: "Library — Aarth Educator" },
      { property: "og:description", content: "Every teaching file and textbook you use." },
    ],
  }),
  component: Content,
});

function subjectLabel(subjectId: string) {
  const subject = subjects.find((item) => item.id === subjectId);
  if (!subject) return "Unassigned";
  return `${subject.name} · ${className(subject.classId)}`;
}

function Content() {
  const [tab, setTab] = useState<"files" | "textbooks">("files");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [upload, setUpload] = useState(false);

  const files = useMemo(
    () =>
      libraryFiles.filter((file) => {
        const subject = subjects.find((item) => item.id === file.subjectId);
        const inScope = scope === "all" || subject?.classId === scope;
        return inScope && file.name.toLowerCase().includes(query.toLowerCase());
      }),
    [query, scope],
  );

  const books = useMemo(
    () =>
      textbooks.filter((book) =>
        `${book.title} ${book.subject} ${book.board}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <AppShell title="Library">
      <div className="space-y-6">
        <PageHeader
          kicker="Library"
          title="Teaching content"
          subtitle="Files your faculty upload, and the board textbooks Aarth generates material from."
          actions={
            <Button onClick={() => setUpload(true)}>
              <Upload className="size-4" /> Upload file
            </Button>
          }
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SegmentedToggle
            value={tab}
            onChange={setTab}
            options={[
              { value: "files", label: `Files (${libraryFiles.length})` },
              { value: "textbooks", label: `Textbooks (${textbooks.length})` },
            ]}
          />
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={tab === "files" ? "Search files" : "Search textbooks"}
            className="lg:w-72"
          />
          {tab === "files" && (
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
          )}
        </div>

        {tab === "files" ? (
          <Card>
            {files.length === 0 ? (
              <EmptyState
                icon={<Library className="size-5" />}
                title="No files here yet"
                description="Upload worksheets, question banks or reference PDFs and tag them to a subject."
                action={
                  <Button onClick={() => setUpload(true)}>
                    <Upload className="size-4" /> Upload file
                  </Button>
                }
              />
            ) : (
              <div className="divide-y divide-border">
                {files.map((file) => (
                  <ListRow
                    key={file.id}
                    icon={<FileText className="size-4" />}
                    title={file.name}
                    subtitle={`${subjectLabel(file.subjectId)} · ${file.size} · ${formatDate(file.uploadedAt)}`}
                    showChevron={false}
                    trailing={
                      <div className="flex items-center gap-2">
                        {file.shared && <Pill tone="tint">Shared</Pill>}
                        <IconButton label="Download" onClick={() => toast.success("Downloading")}>
                          <Download className="size-4" />
                        </IconButton>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
                Textbooks are the source Aarth uses for chapter-accurate notes, quizzes and papers.
                Add one to your library to use it in the Create Studio.
              </p>
              <Link to="/textbooks">
                <Button variant="outline">
                  <BookOpen className="size-4" /> Browse all textbooks
                </Button>
              </Link>
            </Card>
            {books.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<BookOpen className="size-5" />}
                  title="No textbook matched"
                  description="Try a subject name like Physics, or a board like Karnataka State."
                />
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
                  <Card key={book.id} accent className="flex h-full flex-col p-5 pl-6">
                    <div className="flex flex-wrap gap-2">
                      <Pill tone="tint">Class {book.grade}</Pill>
                      <Pill tone="outline">{book.board}</Pill>
                    </div>
                    <h3 className="display mt-3 text-lg text-foreground">{book.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">{book.subject}</p>
                    <div className="mt-4 flex items-center gap-2">
                      {book.inLibrary ? (
                        <Pill tone="tint">In library</Pill>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => toast.success(`${book.title} added to library`)}
                        >
                          <Plus className="size-4" /> Add
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ResponsiveDialog
        open={upload}
        onClose={() => setUpload(false)}
        title="Upload file"
        description="PDF, DOCX or PPTX up to 25 MB. Tag it to a subject so faculty can find it."
        footer={
          <>
            <Button variant="ghost" onClick={() => setUpload(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setUpload(false);
                toast.success("File uploaded");
              }}
            >
              Upload
            </Button>
          </>
        }
      >
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
            <Upload className="size-5" />
          </span>
          <p className="display mt-3 text-lg text-foreground">Drop a file here</p>
          <p className="mt-1 text-xs text-muted-foreground">or click to browse your device</p>
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject</span>
          <select className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary/50">
            {subjects.slice(0, 8).map((subject) => (
              <option key={subject.id}>{subjectLabel(subject.id)}</option>
            ))}
          </select>
        </label>
        <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="size-4 accent-primary" defaultChecked />
          Share with all faculty in this class
        </label>
      </ResponsiveDialog>
    </AppShell>
  );
}
