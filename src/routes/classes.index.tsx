import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Archive,
  BookOpen,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  FilterChips,
  PageHeader,
  Pill,
  SearchField,
  SegmentedToggle,
  Skeleton,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { useApp } from "@/lib/app-context";
import {
  academicYears,
  classes,
  currentAcademicYear,
  subjects,
  type ClassRecord,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classes/")({
  head: () => ({
    meta: [
      { title: "Classes — Aarth Educator" },
      {
        name: "description",
        content:
          "Browse every class in your institution with subjects, terms and academic-year filters.",
      },
      { property: "og:title", content: "Classes — Aarth Educator" },
      { property: "og:description", content: "Every class, subject and term in one place." },
    ],
  }),
  component: Classes,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

const CARD_TONES = [1, 2, 3, 4, 5] as const;

function ClassCard({
  klass,
  canManage,
  tone,
}: {
  klass: ClassRecord;
  canManage: boolean;
  tone: number;
}) {
  const [menu, setMenu] = useState(false);
  const style = {
    backgroundColor: `var(--ev-${tone}-bg)`,
    borderColor: `color-mix(in oklab, var(--ev-${tone}) 22%, transparent)`,
  } as React.CSSProperties;
  const ink = { color: `var(--ev-${tone})` } as React.CSSProperties;

  return (
    <div
      className="press relative overflow-hidden rounded-2xl border p-3.5 transition-shadow hover:shadow-[var(--shadow-card)] md:p-4"
      style={style}
    >
      <Link
        to="/classes/$classId"
        params={{ classId: klass.id }}
        className="block"
        aria-label={klass.name}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]"
            style={ink}
          >
            Grade {klass.grade}
          </span>
          {klass.stream && (
            <span className="truncate text-[10px] font-semibold text-muted-foreground">
              {klass.stream}
            </span>
          )}
        </div>

        <h3 className="display mt-2 truncate text-[15px] leading-snug text-foreground md:text-lg">
          {klass.name}
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {klass.board} · {klass.term}
        </p>

        <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold" style={ink}>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" />
            {klass.studentCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {klass.subjectCount}
          </span>
        </div>
      </Link>

      {canManage && (
        <div className="absolute right-1.5 top-2.5">
          <button
            type="button"
            aria-label="Class actions"
            onClick={() => setMenu((v) => !v)}
            className="press inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-background/60"
          >
            <MoreHorizontal className="size-4" />
          </button>
          {menu && (
            <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-raised)]">
              {[
                { label: "Edit class", icon: Pencil },
                { label: klass.archived ? "Restore" : "Archive", icon: Archive },
                { label: "Delete", icon: Trash2, danger: true },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    toast.success(`${action.label} — ${klass.name}`);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold hover:bg-muted",
                    action.danger ? "text-destructive" : "text-foreground",
                  )}
                >
                  <action.icon className="size-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClassDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(9);
  const [board, setBoard] = useState("NCERT");
  const [stream, setStream] = useState("Science");
  const [year, setYear] = useState(currentAcademicYear);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Create class"
      description="Grades 8–12. Streams apply to Class 11 and 12 only."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={saving}
            onClick={() => {
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                toast.success("Class created");
                onClose();
              }, 800);
            }}
          >
            {saving ? "Saving…" : "Create class"}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Class name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Class 9 — B"
              className={inputClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">Grade</span>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className={inputClass}
              >
                {[8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Class {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">Board</span>
              <select value={board} onChange={(e) => setBoard(e.target.value)} className={inputClass}>
                <option>NCERT</option>
                <option>Karnataka State</option>
              </select>
            </label>
            {grade >= 11 && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">Stream</span>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className={inputClass}
                >
                  <option>Science</option>
                  <option>Commerce</option>
                  <option>Arts</option>
                </select>
              </label>
            )}
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Academic year
              </span>
              <select value={year} onChange={(e) => setYear(e.target.value)} className={inputClass}>
                {academicYears.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">State</span>
              <select className={inputClass} defaultValue="Karnataka">
                <option>Karnataka</option>
                <option>Maharashtra</option>
                <option>Tamil Nadu</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Focus batch with additional Mathematics support."
              className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary/50"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Live preview</p>
          <Card accent className="p-4 pl-5">
            <div className="flex flex-wrap gap-2">
              <Pill tone="tint">Class {grade}</Pill>
              {grade >= 11 && <Pill tone="outline">{stream}</Pill>}
            </div>
            <h3 className="display mt-3 text-lg text-foreground">
              {name || `Class ${grade} — New`}
            </h3>
            <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">
              {description || "Add a short description so faculty know the batch."}
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              0 subjects · {year} · {board}
            </p>
          </Card>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

function Classes() {
  const { isAdmin } = useApp();
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [year, setYear] = useState<string>(currentAcademicYear);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);
  const [loading] = useState(false);

  const list = useMemo(
    () =>
      classes.filter(
        (klass) =>
          Boolean(klass.archived) === (tab === "archived") &&
          klass.academicYear === year &&
          klass.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [tab, year, query],
  );

  const subjectCount = subjects.length;

  return (
    <AppShell title="Classes">
      <div className="space-y-6">
        <PageHeader
          kicker="Workspace"
          title="Classes"
          subtitle={`${classes.filter((c) => !c.archived).length} active classes · ${subjectCount} subjects across the institution`}
          actions={
            isAdmin ? (
              <Button onClick={() => setDialog(true)}>
                <Plus className="size-4" /> Create class
              </Button>
            ) : (
              <Pill tone="outline">Read-only for faculty</Pill>
            )
          }
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SegmentedToggle
            value={tab}
            onChange={setTab}
            options={[
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search classes"
            className="lg:w-72"
          />
          <FilterChips
            value={year}
            onChange={setYear}
            className="lg:ml-auto"
            options={academicYears.map((y) => ({
              value: y,
              label: y,
              ...(y === currentAcademicYear ? { hint: "· current" } : {}),
            }))}
          />
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="mt-4 h-6 w-40" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </Card>
            ))}
          </div>
        ) : list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<GraduationCap className="size-5" />}
              title={tab === "archived" ? "Nothing archived" : "No classes yet"}
              description={
                tab === "archived"
                  ? `No classes were archived in ${year}. Archived batches stay searchable here.`
                  : isAdmin
                    ? "Create your first class to start adding subjects, students and teaching material."
                    : "You haven't been assigned to a class for this academic year yet."
              }
              action={
                tab === "active" && isAdmin ? (
                  <Button onClick={() => setDialog(true)}>
                    <Plus className="size-4" /> Create class
                  </Button>
                ) : undefined
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((klass) => (
              <ClassCard key={klass.id} klass={klass} canManage={isAdmin} />
            ))}
          </div>
        )}
      </div>

      <ClassDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
