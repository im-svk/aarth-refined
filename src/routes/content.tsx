import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  FolderUp,
  Plus,
  Search,
  Upload,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import { Button, IconButton, Pill } from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import {
  className,
  formatDate,
  libraryFiles,
  subjects,
  textbooks,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Library — Aarth Educator" },
      {
        name: "description",
        content:
          "Your teaching library: files you upload, board textbooks and notes shared by faculty.",
      },
      { property: "og:title", content: "Library — Aarth Educator" },
      { property: "og:description", content: "Every teaching file and textbook you use." },
    ],
  }),
  component: Content,
});

type Shelf = "uploads" | "academic" | "shared";

const SHELVES: {
  id: Shelf;
  label: string;
  hint: string;
  tone: string;
  bg: string;
  icon: typeof FolderUp;
}[] = [
  {
    id: "uploads",
    label: "My Uploads",
    hint: "Files you added",
    tone: "text-ev-1",
    bg: "bg-ev-1-bg",
    icon: FolderUp,
  },
  {
    id: "academic",
    label: "Academic Library",
    hint: "Board textbooks",
    tone: "text-ev-3",
    bg: "bg-ev-3-bg",
    icon: BookOpen,
  },
  {
    id: "shared",
    label: "Shared Notes",
    hint: "From your faculty",
    tone: "text-ev-2",
    bg: "bg-ev-2-bg",
    icon: Users,
  },
];

function subjectLabel(subjectId: string) {
  const subject = subjects.find((item) => item.id === subjectId);
  if (!subject) return "Unassigned";
  return `${subject.name} · ${className(subject.classId)}`;
}

function Content() {
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [upload, setUpload] = useState(false);

  const counts = useMemo(
    () => ({
      uploads: libraryFiles.length,
      academic: textbooks.length,
      shared: libraryFiles.filter((file) => file.shared).length,
    }),
    [],
  );

  const q = query.trim().toLowerCase();

  const files = useMemo(() => {
    const base = shelf === "shared" ? libraryFiles.filter((f) => f.shared) : libraryFiles;
    return base.filter((file) =>
      `${file.name} ${subjectLabel(file.subjectId)}`.toLowerCase().includes(q),
    );
  }, [shelf, q]);

  const books = useMemo(
    () =>
      textbooks.filter((book) =>
        `${book.title} ${book.subject} ${book.board}`.toLowerCase().includes(q),
      ),
    [q],
  );

  const active = SHELVES.find((item) => item.id === shelf);

  return (
    <AppShell title="Library" mobileHeader="none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          {active ? (
            <button
              type="button"
              onClick={() => {
                setShelf(null);
                setQuery("");
                setSearchOpen(false);
              }}
              aria-label="Back to library"
              className="press inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-card)]"
            >
              <ArrowLeft className="size-4" />
            </button>
          ) : null}

          {searchOpen ? (
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={active ? `Search ${active.label}` : "Search your library"}
                  className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="press text-sm font-medium text-primary"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <h1 className="display truncate text-[1.75rem] leading-tight text-foreground">
                  {active ? active.label : "Your Library"}
                </h1>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                  {active
                    ? active.id === "academic"
                      ? `${counts.academic} textbooks`
                      : `${active.id === "shared" ? counts.shared : counts.uploads} files`
                    : `${counts.uploads + counts.academic} items · files, textbooks and notes`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search library"
                className="press inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-card)]"
              >
                <Search className="size-4" />
              </button>
              {!active && (
                <button
                  type="button"
                  onClick={() => setUpload(true)}
                  aria-label="Upload file"
                  className="press inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-raised)]"
                >
                  <Plus className="size-4" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Shelves */}
        {!active ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SHELVES.map((item) => {
                const Icon = item.icon;
                const count = counts[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setShelf(item.id)}
                    className="press hairline-card flex items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-[var(--shadow-card)]"
                  >
                    <span
                      className={cn(
                        "flex size-14 shrink-0 items-center justify-center rounded-xl",
                        item.bg,
                        item.tone,
                      )}
                    >
                      <Icon className="size-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {count} · {item.hint}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                );
              })}
            </div>

            <section className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-foreground">Recently added</h2>
                <button
                  type="button"
                  onClick={() => setShelf("uploads")}
                  className="press text-xs font-medium text-primary"
                >
                  See all
                </button>
              </div>
              <ul className="space-y-1">
                {libraryFiles.slice(0, 4).map((file) => (
                  <FileRow key={file.id} file={file} />
                ))}
              </ul>
            </section>
          </div>
        ) : active.id === "academic" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Textbooks</h2>
              <Link to="/textbooks" className="press text-xs font-medium text-primary">
                Browse all
              </Link>
            </div>
            {books.length === 0 ? (
              <Empty label="No textbook matched that search." />
            ) : (
              <ul className="grid gap-1 md:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
                  <li key={book.id}>
                    <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/60">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-ev-3-bg text-ev-3">
                        <BookOpen className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{book.title}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {book.board} · {book.subject}
                        </p>
                      </div>
                      {book.inLibrary ? (
                        <Pill tone="tint">Added</Pill>
                      ) : (
                        <IconButton
                          label={`Add ${book.title}`}
                          onClick={() => toast.success(`${book.title} added to library`)}
                        >
                          <Plus className="size-4" />
                        </IconButton>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {files.length === 0 ? (
              <Empty
                label={
                  active.id === "shared"
                    ? "Nothing has been shared with you yet."
                    : "You haven't uploaded any files yet."
                }
                action={
                  active.id === "uploads" ? (
                    <Button onClick={() => setUpload(true)}>
                      <Upload className="size-4" /> Upload file
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <ul className="space-y-1">
                {files.map((file) => (
                  <FileRow key={file.id} file={file} />
                ))}
              </ul>
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

function FileRow({ file }: { file: (typeof libraryFiles)[number] }) {
  return (
    <li className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/60">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-ev-1-bg text-ev-1">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {file.shared ? "Shared · " : ""}
          {subjectLabel(file.subjectId)} · {file.size} · {formatDate(file.uploadedAt)}
        </p>
      </div>
      <IconButton label={`Download ${file.name}`} onClick={() => toast.success("Downloading")}>
        <Download className="size-4" />
      </IconButton>
    </li>
  );
}

function Empty({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="hairline-card rounded-2xl bg-card px-4 py-10 text-center">
      <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <X className="size-5" />
      </span>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
