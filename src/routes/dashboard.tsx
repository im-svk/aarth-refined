import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Copy, FileText, Plus, Share2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import { Button, Card, ListRow, Pill, SectionHeader } from "@/components/aarth/primitives";
import { NotesStudioIcon } from "@/components/aarth/workspace-icons";
import { useApp } from "@/lib/app-context";
import { aiDocuments, className, classes, formatDate, libraryFiles, relativeTime, subjects } from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Teacher workspace — Aarth Notes AI" },
      {
        name: "description",
        content: "A simple teacher workspace for notes, AI study material, and class-code sharing.",
      },
      { property: "og:title", content: "Teacher workspace — Aarth Notes AI" },
      { property: "og:description", content: "Notes, AI study material, and student sharing in one clean workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const activeClasses = classes.filter((klass) => !klass.archived).slice(0, 2);
const sharedNotes = libraryFiles.filter((file) => file.shared);
const recentItems = [
  ...aiDocuments.slice(0, 2).map((doc) => ({
    id: doc.id,
    title: doc.title,
    subtitle: `${doc.subject} · ${className(doc.classId)} · edited ${relativeTime(doc.updatedAt)}`,
    icon: <Sparkles className="size-4" />,
    to: "/aidocs" as const,
    tag: "AI draft",
  })),
  ...libraryFiles.slice(0, 2).map((file) => {
    const subject = subjects.find((item) => item.id === file.subjectId);
    return {
      id: file.id,
      title: file.name,
      subtitle: `${subject?.name ?? "Notes"} · ${subject ? className(subject.classId) : "Class notes"} · ${formatDate(file.uploadedAt)}`,
      icon: <FileText className="size-4" />,
      to: "/notes" as const,
      tag: file.shared ? "Shared" : "Private",
    };
  }),
];

function StudyMaterialArt() {
  return (
    <svg viewBox="0 0 220 160" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="home-study-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ev-1-bg)" />
          <stop offset="100%" stopColor="var(--ev-1)" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <rect x="14" y="18" width="192" height="124" rx="28" fill="url(#home-study-card)" />
      <rect x="44" y="42" width="70" height="88" rx="14" fill="var(--card)" stroke="var(--ev-1)" strokeWidth="2" />
      <rect x="58" y="62" width="42" height="6" rx="3" fill="var(--ev-1)" opacity="0.28" />
      <rect x="58" y="78" width="34" height="6" rx="3" fill="var(--ev-1)" opacity="0.18" />
      <rect x="58" y="94" width="42" height="6" rx="3" fill="var(--ev-1)" opacity="0.18" />
      <rect x="124" y="50" width="54" height="54" rx="16" fill="var(--card)" stroke="var(--ev-2)" strokeWidth="2" />
      <path d="m151 63 2.4 7.4h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" fill="var(--ev-2)" />
      <circle cx="176" cy="40" r="11" fill="var(--ev-4)" />
      <path d="M72 130h84" stroke="var(--ev-1)" strokeWidth="8" strokeLinecap="round" opacity="0.14" />
    </svg>
  );
}

function MiniStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Dashboard() {
  const { teacherProfile, user } = useApp();
  const primaryCode = teacherProfile.classCodes[0] ?? teacherProfile.inviteCode;

  return (
    <AppShell title="Home" mobileHeader="brand">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
            <div>
              <Pill tone="tint">{teacherProfile.institution}</Pill>
              <h1 className="display mt-3 text-[1.9rem] leading-tight text-foreground sm:text-[2.4rem]">
                Your notes workspace, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Create notes, generate clean study material, and share everything with students using one class code.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to="/notes">
                  <Button className="h-11 w-full rounded-full sm:w-auto">
                    <Plus className="size-4" /> New note
                  </Button>
                </Link>
                <Link to="/aidocs">
                  <Button variant="outline" className="h-11 w-full rounded-full sm:w-auto">
                    <Sparkles className="size-4" /> AI material
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <StudyMaterialArt />
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          <MiniStat label="Shared notes" value={sharedNotes.length} />
          <MiniStat label="Subjects" value={teacherProfile.subjects.join(", ")} />
          <MiniStat label="Class code" value={<span className="font-mono">{primaryCode}</span>} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <SectionHeader title="Recent notes" hint="Drafts and uploads ready for class" />
            <Card className="mt-3">
              <div className="divide-y divide-border">
                {recentItems.map((item) => (
                  <Link key={item.id} to={item.to}>
                    <ListRow
                      icon={item.icon}
                      title={item.title}
                      subtitle={item.subtitle}
                      trailing={<Pill tone={item.tag === "Shared" ? "tint" : "outline"}>{item.tag}</Pill>}
                      interactive
                    />
                  </Link>
                ))}
              </div>
            </Card>
          </section>

          <section className="space-y-5">
            <div>
              <SectionHeader title="Share with students" hint="No student account required" />
              <Card className="mt-3 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
                    <Share2 className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">Class access code</p>
                    <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-foreground">{primaryCode}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Students enter this code to see shared notes by subject.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => toast.success(`Code ${primaryCode} copied`)}
                    className="rounded-full"
                  >
                    <Copy className="size-4" /> Copy code
                  </Button>
                  <Link to="/student-view">
                    <Button className="w-full rounded-full">Preview student view</Button>
                  </Link>
                </div>
              </Card>
            </div>

            <div>
              <SectionHeader title="My classes" hint="Connected to this teacher code" />
              <Card className="mt-3">
                <div className="divide-y divide-border">
                  {activeClasses.map((klass) => (
                    <ListRow
                      key={klass.id}
                      icon={<NotesStudioIcon />}
                      title={klass.name}
                      subtitle={`${klass.board} · ${klass.term}`}
                      trailing={<Pill tone="outline">{klass.studentCount} students</Pill>}
                      showChevron={false}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
