import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
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

  return (
    <div className="press relative flex items-center gap-3.5 rounded-[20px] border border-border/70 bg-card px-4 py-3.5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]">
      <Link
        to="/classes/$classId"
        params={{ classId: klass.id }}
        className="flex min-w-0 flex-1 items-center gap-3.5"
        aria-label={klass.name}
      >
        <span
          className="display flex size-11 shrink-0 items-center justify-center rounded-[14px] text-[17px] font-semibold tabular-nums"
          style={{
            backgroundColor: `var(--ev-${tone}-bg)`,
            color: `color-mix(in oklab, var(--ev-${tone}) 78%, var(--foreground))`,
          }}
          aria-hidden
        >
          {klass.grade}
        </span>

        <span className="min-w-0 flex-1">
          <span className="display block truncate text-[16px] font-semibold leading-tight tracking-[-0.015em] text-foreground">
            {klass.name}
          </span>
          <span className="mt-1 flex items-center gap-1.5 truncate text-[12.5px] font-medium text-muted-foreground">
            <span className="truncate">{klass.board}</span>
            <span className="size-1 shrink-0 rounded-full bg-border" />
            <span className="shrink-0">{klass.term}</span>
            {klass.stream && (
              <>
                <span className="size-1 shrink-0 rounded-full bg-border" />
                <span className="truncate">{klass.stream}</span>
              </>
            )}
          </span>
          <span className="mt-1 block truncate text-[12px] font-medium text-muted-foreground/80 tabular-nums">
            {klass.studentCount} students · {klass.subjectCount} subjects
          </span>
        </span>
      </Link>

      {canManage ? (
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Class actions"
            onClick={() => setMenu((v) => !v)}
            className="press inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
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
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />
      )}
    </div>
  );
}

function ClassesHeroArt() {
  return (
    <svg viewBox="0 0 80 80" className="size-24 text-primary md:size-28" aria-hidden>
      <defs>
        <linearGradient id="classes-hero-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="72" height="72" rx="18" fill="url(#classes-hero-grad)" />
      <rect
        x="18"
        y="26"
        width="44"
        height="32"
        rx="6"
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.28"
      />
      <path
        d="M26 36h28M26 44h20M26 52h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <circle
        cx="58"
        cy="26"
        r="11"
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.28"
      />
      <path
        d="M58 21v7l5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.65"
      />
    </svg>
  );
}

function ClassesHeroCard({
  year,
  totalClasses,
  totalStudents,
}: {
  year: string;
  totalClasses: number;
  totalStudents: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.06] via-card to-card p-5 shadow-[var(--shadow-card)] md:p-6">
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/80">
            Academic year {year}
          </p>
          <h2 className="display mt-1 text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
            All your classes in one place
          </h2>
          <p className="mt-1 max-w-md text-[13px] text-muted-foreground">
            Manage grades, subjects, students and terms for every batch.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground">
              <GraduationCap className="size-3.5 text-primary" />
              {totalClasses} classes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground">
              <Users className="size-3.5 text-primary" />
              {totalStudents} students
            </span>
          </div>
        </div>
        <div className="hidden shrink-0 sm:block">
          <ClassesHeroArt />
        </div>
      </div>
    </div>
  );
}

function YearDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Academic year"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "press inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-[13px] font-semibold transition-colors",
          open
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground shadow-[var(--shadow-card)]",
        )}
      >
        <SlidersHorizontal className="size-4" />
        <span className="tabular-nums">{value}</span>
        <ChevronDown className="size-3.5 opacity-70" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-[var(--shadow-raised)]">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Academic year
          </p>
          {academicYears.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => {
                onChange(y);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold",
                y === value ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
              )}
            >
              <span className="tabular-nums">{y}</span>
              {y === currentAcademicYear && (
                <span className="text-[10px] font-medium text-muted-foreground">current</span>
              )}
            </button>
          ))}
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
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
  const yearClasses = useMemo(
    () => classes.filter((c) => c.academicYear === year && !c.archived),
    [year],
  );
  const totalStudents = yearClasses.reduce((sum, c) => sum + c.studentCount, 0);

  return (
    <AppShell title="Classes" mobileHeader="none">
      <div className="space-y-4 md:space-y-6">
        <div
          className="flex items-center justify-between md:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {!searchOpen ? (
            <>
              <div className="min-w-0">
                <h1 className="display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
                  Classes
                </h1>
                <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">
                  {yearClasses.length} classes · {totalStudents} students
                </p>
              </div>
              <button
                type="button"
                aria-label="Search classes"
                onClick={() => setSearchOpen(true)}
                className="press inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-card)]"
              >
                <Search className="size-[18px]" />
              </button>
            </>
          ) : (
            <div className="flex w-full items-center gap-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search classes"
                className="h-11 flex-1 rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="press inline-flex h-11 items-center justify-center rounded-xl px-3 text-[13px] font-semibold text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          )}
        </div>



        <div className="hidden md:block">
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
        </div>

        <ClassesHeroCard
          year={year}
          totalClasses={yearClasses.length}
          totalStudents={totalStudents}
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <SegmentedToggle
              value={tab}
              onChange={setTab}
              options={[
                { value: "active", label: "Active" },
                { value: "archived", label: "Archived" },
              ]}
              className="flex-1 md:flex-none"
            />
            <div className="relative md:hidden">
              <button
                type="button"
                aria-label="Filter by academic year"
                onClick={() => setFilterOpen((v) => !v)}
                className={cn(
                  "press inline-flex h-11 items-center gap-1.5 rounded-xl border px-3 transition-colors",
                  filterOpen
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground shadow-[var(--shadow-card)]",
                )}
              >
                <SlidersHorizontal className="size-4" />
                <span className="text-[11px] font-semibold tabular-nums">{year}</span>
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-[var(--shadow-raised)]">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Academic year
                  </p>
                  {academicYears.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setYear(y);
                        setFilterOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold",
                        y === year ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                      )}
                    >
                      <span className="tabular-nums">{y}</span>
                      {y === currentAcademicYear && (
                        <span className="text-[10px] font-medium text-muted-foreground">
                          current
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search classes"
              className="lg:w-72"
            />
          </div>
          <div className="hidden md:block lg:ml-auto">
            <FilterChips
              value={year}
              onChange={setYear}
              options={academicYears.map((y) => ({
                value: y,
                label: y,
                ...(y === currentAcademicYear ? { hint: "· current" } : {}),
              }))}
            />
          </div>
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
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {list.map((klass, i) => (
              <ClassCard
                key={klass.id}
                klass={klass}
                canManage={isAdmin}
                tone={CARD_TONES[i % CARD_TONES.length]!}
              />
            ))}
          </div>
        )}
      </div>

      <ClassDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
