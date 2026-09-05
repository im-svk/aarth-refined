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

/* ---------- illustrations ---------- */

const ink = (t: number) => `var(--ev-${t})`;
const wash = (t: number) => `var(--ev-${t}-bg)`;
const warm = "var(--ev-4)";

function UploadsArt() {
  const t = 1;
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden>
      <path
        d="M5 12.5a3 3 0 013-3h6.2l2.6 3H32a3 3 0 013 3V29a3 3 0 01-3 3H8a3 3 0 01-3-3z"
        fill={wash(t)}
        stroke={ink(t)}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="14" y="6" width="12" height="15" rx="2.5" fill="var(--card)" stroke={ink(t)} strokeWidth="1.5" />
      <path d="M20 17.5v-7m0 0l-2.6 2.6M20 10.5l2.6 2.6" stroke={warm} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20h30" stroke={ink(t)} strokeWidth="1.4" opacity="0.25" />
    </svg>
  );
}

function BooksArt() {
  const t = 3;
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden>
      <rect x="6" y="11" width="7" height="22" rx="2" fill={wash(t)} stroke={ink(t)} strokeWidth="1.5" />
      <rect x="14" y="7" width="7" height="26" rx="2" fill="var(--card)" stroke={ink(t)} strokeWidth="1.5" />
      <rect x="22" y="13" width="7" height="20" rx="2" fill={warm} opacity="0.85" />
      <path d="M8 16h3M16 12h3" stroke={ink(t)} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <circle cx="29.5" cy="10.5" r="4.5" fill={ink(t)} />
      <path d="M27.4 10.6l1.4 1.4 2.6-3" stroke="var(--card)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SharedArt() {
  const t = 2;
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden>
      <rect x="6" y="8" width="17" height="23" rx="3" fill={wash(t)} stroke={ink(t)} strokeWidth="1.5" transform="rotate(-7 14.5 19.5)" />
      <rect x="13" y="7" width="18" height="24" rx="3" fill="var(--card)" stroke={ink(t)} strokeWidth="1.6" />
      <path d="M17.5 13h9M17.5 17.5h9M17.5 22h6" stroke={ink(t)} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <circle cx="29.5" cy="28.5" r="5" fill={warm} />
      <circle cx="29.5" cy="26.9" r="1.5" fill="var(--card)" />
      <path d="M26.9 31.4a2.8 2.8 0 015.2 0z" fill="var(--card)" />
    </svg>
  );
}

const SHELVES: {
  id: Shelf;
  label: string;
  hint: string;
  bg: string;
  art: () => React.ReactElement;
}[] = [
  { id: "uploads", label: "My Uploads", hint: "Files you added", bg: "bg-ev-1-bg", art: UploadsArt },
  {
    id: "academic",
    label: "Academic Library",
    hint: "Board textbooks",
    bg: "bg-ev-3-bg",
    art: BooksArt,
  },
  { id: "shared", label: "Shared Notes", hint: "From your faculty", bg: "bg-ev-2-bg", art: SharedArt },
];

function DocArt({ tone = 1 }: { tone?: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-7" aria-hidden>
      <path
        d="M10 6.5a2.5 2.5 0 012.5-2.5H23l7 7v22.5a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 0110 33.5z"
        fill="var(--card)"
        stroke={ink(tone)}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M23 4v7h7" fill={wash(tone)} stroke={ink(tone)} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14.5 18h11M14.5 22.5h11M14.5 27h7" stroke={ink(tone)} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <circle cx="27" cy="28.5" r="3.2" fill={warm} />
    </svg>
  );
}

function BookArt({ tone = 3 }: { tone?: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-7" aria-hidden>
      <path
        d="M7 8.5A2.5 2.5 0 019.5 6H18c1.1 0 2 .9 2 2v24c0-1.1-.9-2-2-2H7z"
        fill={wash(tone)}
        stroke={ink(tone)}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M33 8.5A2.5 2.5 0 0030.5 6H22c-1.1 0-2 .9-2 2v24c0-1.1.9-2 2-2h11z"
        fill="var(--card)"
        stroke={ink(tone)}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M23.5 13h6M23.5 17.5h6" stroke={ink(tone)} strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />
      <path d="M26 30v5l2-1.6 2 1.6v-5z" fill={warm} />
    </svg>
  );
}



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
                const Art = item.art;
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
                        "flex size-14 shrink-0 items-center justify-center rounded-2xl",
                        item.bg,
                      )}
                    >
                      <Art />
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
