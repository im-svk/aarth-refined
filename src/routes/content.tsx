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

function Defs({ id, tone }: { id: string; tone: number }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={wash(tone)} />
        <stop offset="100%" stopColor={ink(tone)} stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--card)" />
        <stop offset="100%" stopColor={wash(tone)} />
      </linearGradient>
      <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={warm} stopOpacity="0.95" />
        <stop offset="100%" stopColor={warm} stopOpacity="0.7" />
      </linearGradient>
    </defs>
  );
}

function UploadsArt() {
  const t = 1;
  const id = "art-up";
  return (
    <svg viewBox="0 0 48 48" className="size-11" aria-hidden>
      <Defs id={id} tone={t} />
      {/* back folder */}
      <path
        d="M5 15.5a3.5 3.5 0 013.5-3.5h8.2l3 3.6h14.8a3.5 3.5 0 013.5 3.5v3H5z"
        fill={ink(t)}
        opacity="0.28"
      />
      {/* documents peeking */}
      <rect x="14" y="8" width="14" height="17" rx="2.6" fill="var(--card)" stroke={ink(t)} strokeWidth="1.4" transform="rotate(-8 21 16.5)" />
      <path d="M15.6 14.4l8.4-1.2M16.1 17.8l8.4-1.2" stroke={ink(t)} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
      <rect x="22" y="6" width="15" height="18" rx="2.8" fill="var(--card)" stroke={ink(t)} strokeWidth="1.5" transform="rotate(6 29.5 15)" />
      <path d="M25.6 12h8.2M25.2 15.6h8.2M25 19.2h5" stroke={ink(t)} strokeWidth="1.3" opacity="0.35" strokeLinecap="round" />
      {/* front folder */}
      <path
        d="M4.5 21.5h39v14.5a4 4 0 01-4 4h-31a4 4 0 01-4-4z"
        fill={`url(#${id}-g)`}
        stroke={ink(t)}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4.5 21.5h39" stroke={ink(t)} strokeWidth="1.6" opacity="0.6" />
      {/* upload badge */}
      <circle cx="36.5" cy="33" r="7" fill={`url(#${id}-w)`} />
      <path d="M36.5 36.4v-6.6m0 0l-2.6 2.7M36.5 29.8l2.6 2.7" stroke="var(--card)" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BooksArt() {
  const t = 3;
  const id = "art-bk";
  return (
    <svg viewBox="0 0 48 48" className="size-11" aria-hidden>
      <Defs id={id} tone={t} />
      <rect x="6" y="16" width="8.5" height="26" rx="2.4" fill={`url(#${id}-s)`} stroke={ink(t)} strokeWidth="1.5" />
      <path d="M8.6 21h3.4M8.6 24.4h3.4" stroke={ink(t)} strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
      <rect x="15.5" y="11" width="9" height="31" rx="2.4" fill={`url(#${id}-g)`} stroke={ink(t)} strokeWidth="1.5" />
      <path d="M18 16.5h4M18 20h4" stroke={ink(t)} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <rect x="25.5" y="19" width="8.5" height="23" rx="2.4" fill={warm} opacity="0.9" />
      <path d="M28 24h3.4M28 27.4h3.4" stroke="var(--card)" strokeWidth="1.3" opacity="0.8" strokeLinecap="round" />
      {/* open book on top */}
      <path
        d="M33 12.5c2.4-1.6 5.4-1.6 7.5 0v11c-2.1-1.6-5.1-1.6-7.5 0z"
        fill="var(--card)"
        stroke={ink(t)}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M33 12.5c-2.4-1.6-4.6-1.6-6.6 0v11c2-1.6 4.2-1.6 6.6 0z"
        fill={wash(t)}
        stroke={ink(t)}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M33 12.5v11" stroke={ink(t)} strokeWidth="1.3" opacity="0.5" />
      <circle cx="41" cy="35" r="6" fill={ink(t)} />
      <path d="M38.4 35.1l1.8 1.8 3.2-3.6" stroke="var(--card)" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SharedArt() {
  const t = 2;
  const id = "art-sh";
  return (
    <svg viewBox="0 0 48 48" className="size-11" aria-hidden>
      <Defs id={id} tone={t} />
      <rect x="6" y="10" width="20" height="27" rx="3.5" fill={`url(#${id}-g)`} stroke={ink(t)} strokeWidth="1.4" transform="rotate(-8 16 23.5)" />
      <rect x="13" y="7" width="22" height="29" rx="3.5" fill="var(--card)" stroke={ink(t)} strokeWidth="1.6" />
      <path d="M18 14h12M18 19h12M18 24h7.5" stroke={ink(t)} strokeWidth="1.5" opacity="0.38" strokeLinecap="round" />
      <path d="M18 29h5" stroke={warm} strokeWidth="1.8" strokeLinecap="round" />
      {/* people */}
      <circle cx="31" cy="33" r="8" fill={`url(#${id}-w)`} stroke="var(--card)" strokeWidth="1.6" />
      <circle cx="31" cy="30.4" r="2.4" fill="var(--card)" />
      <path d="M26.7 37.4a4.5 4.5 0 018.6 0z" fill="var(--card)" />
      <circle cx="40.5" cy="30.5" r="5.5" fill={ink(t)} stroke="var(--card)" strokeWidth="1.5" />
      <circle cx="40.5" cy="28.7" r="1.7" fill="var(--card)" />
      <path d="M37.6 33.6a3.1 3.1 0 015.8 0z" fill="var(--card)" />
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
  const id = `doc-${tone}`;
  return (
    <svg viewBox="0 0 48 48" className="size-8" aria-hidden>
      <Defs id={id} tone={tone} />
      <path
        d="M13 8.5A3.5 3.5 0 0116.5 5h11L36 13.5v26A3.5 3.5 0 0132.5 43h-16A3.5 3.5 0 0113 39.5z"
        fill={`url(#${id}-s)`}
        stroke={ink(tone)}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M27.5 5v8.5H36" fill={wash(tone)} stroke={ink(tone)} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 21h13M18 26h13M18 31h8" stroke={ink(tone)} strokeWidth="1.6" opacity="0.35" strokeLinecap="round" />
      <circle cx="33" cy="34.5" r="5.5" fill={`url(#${id}-w)`} />
      <path d="M30.7 34.6l1.6 1.6 2.9-3.2" stroke="var(--card)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookArt({ tone = 3 }: { tone?: number }) {
  const id = `bk-${tone}`;
  return (
    <svg viewBox="0 0 48 48" className="size-8" aria-hidden>
      <Defs id={id} tone={tone} />
      <path
        d="M8 11a3 3 0 013-3h10c1.4 0 2.5 1.1 2.5 2.5v29c0-1.4-1.1-2.5-2.5-2.5H8z"
        fill={`url(#${id}-g)`}
        stroke={ink(tone)}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M40 11a3 3 0 00-3-3H27c-1.4 0-2.5 1.1-2.5 2.5v29c0-1.4 1.1-2.5 2.5-2.5h13z"
        fill="var(--card)"
        stroke={ink(tone)}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M28.5 16h8M28.5 21h8M28.5 26h5" stroke={ink(tone)} strokeWidth="1.4" opacity="0.35" strokeLinecap="round" />
      <path d="M12 16h7M12 21h7" stroke={ink(tone)} strokeWidth="1.4" opacity="0.3" strokeLinecap="round" />
      <path d="M31 32v9l3-2.4 3 2.4v-9z" fill={`url(#${id}-w)`} stroke="var(--card)" strokeWidth="1.2" strokeLinejoin="round" />
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
                        "flex size-16 shrink-0 items-center justify-center rounded-[1.15rem] ring-1 ring-inset ring-border/60",
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
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ev-3-bg ring-1 ring-inset ring-border/50">
                        <BookArt />
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
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ev-1-bg ring-1 ring-inset ring-border/50">
        <DocArt tone={file.shared ? 2 : 1} />
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
