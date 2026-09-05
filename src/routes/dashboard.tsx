import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Layers,
  Library,
  Plus,
  Users,
  UserSquare2,
} from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import { CreateBanner } from "@/components/aarth/create-banner";
import { DayTimeline } from "@/components/aarth/day-timeline";

import {
  Button,
  Card,
  EmptyState,
  ListRow,
  PageHeader,
  Pill,
  SectionHeader,
  StatTile,
} from "@/components/aarth/primitives";
import { useApp } from "@/lib/app-context";
import {
  aiDocuments,
  classes,
  className,
  greeting,
  INSTITUTION,
  relativeTime,
  students,
  subjects,
  teachers,
  todayLabel,
  todaySchedule,
} from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — Aarth Educator" },
      {
        name: "description",
        content:
          "Your teaching day at a glance: active classes, today's schedule and recent AI-generated material.",
      },
      { property: "og:title", content: "Home — Aarth Educator" },
      { property: "og:description", content: "Your teaching day at a glance." },
    ],
  }),
  component: Dashboard,
});

const active = classes.filter((c) => !c.archived);

type Activity = {
  id: string;
  title: string;
  subtitle: string;
  status?: string;
  to: "/aidocs" | "/quizzes" | "/papers" | "/presentations";
  icon: typeof FileText;
};

const recentActivity: Activity[] = [
  ...quizzes
    .filter((q) => q.status === "draft")
    .map((q) => ({
      id: q.id,
      title: q.title,
      subtitle: `Quiz · ${q.subject} · ${q.questions} questions`,
      status: "Draft",
      to: "/quizzes" as const,
      icon: ClipboardList,
    })),
  ...aiDocuments.slice(0, 3).map((doc) => ({
    id: doc.id,
    title: doc.title,
    subtitle: `${doc.subject} · edited ${relativeTime(doc.updatedAt)}`,
    to: "/aidocs" as const,
    icon: FileText,
  })),
].slice(0, 4);

const workspaceTools: { to: Activity["to"]; label: string; hint: string; icon: typeof FileText }[] =
  [
    { to: "/aidocs", label: "Notes studio", hint: "3 documents in progress", icon: FileText },
    { to: "/quizzes", label: "Quiz builder", hint: "1 draft waiting to publish", icon: ClipboardList },
    { to: "/papers", label: "Question papers", hint: "Mid-term set, last opened Monday", icon: Layers },
    { to: "/presentations", label: "Presentations", hint: "Start a deck from a lesson plan", icon: Library },
  ];

function ClassRows() {
  if (active.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="size-5" />}
        title="No classes created yet"
        description="Once classes are added they'll appear here with their subjects and student counts."
      />
    );
  }
  return (
    <div className="divide-y divide-border">
      {active.slice(0, 5).map((klass) => (
        <Link key={klass.id} to="/classes/$classId" params={{ classId: klass.id }}>
          <ListRow
            icon={<span className="text-xs font-bold">{klass.grade}</span>}
            title={klass.name}
            subtitle={`${klass.subjectCount} subjects · ${klass.studentCount} students · ${klass.term}`}
            trailing={<Pill tone="outline">{klass.board}</Pill>}
            interactive
          />
        </Link>
      ))}
    </div>
  );
}

function TeacherHome() {
  const featured = active[3]!;
  return (
    <div className="space-y-6">
      {/* Phone greeting — logo + profile live in the top bar */}
      <div className="md:hidden">
        <p className="eyebrow text-muted-foreground">{todayLabel}</p>
        <h1 className="display-lg mt-1.5 text-[1.65rem] text-foreground">
          {greeting()}, <em>Ananya</em>
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">{INSTITUTION.name}</p>
      </div>

      <div className="hidden md:block">
        <PageHeader
          kicker={todayLabel}
          title={
            <>
              {greeting()}, <em className="text-primary">Ananya</em>
            </>
          }
          subtitle="Two classes today and one paper waiting on you."
        />
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-12">
        {/* Today's schedule — calendar day view */}
        <Card className="p-4 sm:p-5 lg:col-span-8 lg:row-span-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h3 className="display text-lg text-foreground">Today's classes</h3>
              <p className="truncate text-xs text-muted-foreground">
                {todayLabel} · {todaySchedule.length} periods
              </p>
            </div>
            <Link
              to="/calendar"
              aria-label="Open full calendar"
              className="press inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <CalendarDays className="size-4" />
              <span className="hidden sm:inline">Full calendar</span>
            </Link>
          </div>

          {todaySchedule.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="size-5" />}
              title="Nothing scheduled today"
              description="Your timetable is clear — a good day to prepare material."
            />
          ) : (
            <DayTimeline items={todaySchedule} nowMinutes={575} className="mt-4" />
          )}
        </Card>

        {/* Create banner — rotating */}
        <CreateBanner className="lg:col-span-4" />

        {/* Recent activity */}
        <section className="lg:col-span-6">
          <SectionHeader title="Recent activity" hint="Drafts and edits from the last few days" />
          <Card className="mt-3">
            <div className="divide-y divide-border">
              {recentActivity.map((item) => (
                <Link key={item.id} to={item.to}>
                  <ListRow
                    icon={<item.icon className="size-4" />}
                    title={item.title}
                    subtitle={item.subtitle}
                    trailing={item.status ? <Pill tone="outline">{item.status}</Pill> : undefined}
                    interactive
                  />
                </Link>
              ))}
            </div>
          </Card>
        </section>

        {/* Continue workspace tools */}
        <section className="lg:col-span-6">
          <SectionHeader title="Continue workspace tools" hint="Pick up where you left off" />
          <Card className="mt-3">
            <div className="divide-y divide-border">
              {workspaceTools.map((tool) => (
                <Link key={tool.to} to={tool.to}>
                  <ListRow
                    icon={<tool.icon className="size-4" />}
                    title={tool.label}
                    subtitle={tool.hint}
                    interactive
                  />
                </Link>
              ))}
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}


function AdminHome() {
  const featured = active[2]!;
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Institution overview"
        title={
          <>
            {greeting()}, <em className="text-primary">Rajesh</em>
          </>
        }
        subtitle={`${INSTITUTION.name} · ${INSTITUTION.area}, ${INSTITUTION.city}`}
      />

      <Card accent className="p-5 pl-6 md:p-7 md:pl-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <Pill tone="tint">{active.length} active classes</Pill>
            <h2 className="display mt-3 text-2xl text-foreground md:text-3xl">{featured.name}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Largest batch this term · {featured.studentCount} students · {featured.teacherCount}{" "}
              faculty
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/classes">
              <Button>
                <Plus className="size-4" /> Create class
              </Button>
            </Link>
            <Link to="/students">
              <Button variant="outline">Invite people</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Classes" value={active.length} hint="2026–27" icon={<GraduationCap className="size-4" />} />
        <StatTile label="Faculty" value={teachers.length} hint="All departments" icon={<UserSquare2 className="size-4" />} />
        <StatTile label="Students" value={students.length * 24} hint="Enrolled" icon={<Users className="size-4" />} />
        <StatTile label="Subjects" value={subjects.length} hint="Across classes" icon={<BookOpen className="size-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <SectionHeader
            title="Active classes"
            action={
              <Link to="/classes" className="text-xs font-semibold text-primary">
                View all
              </Link>
            }
          />
          <Card className="mt-3">
            <ClassRows />
          </Card>
        </section>

        <section>
          <SectionHeader title="Institution setup" hint="Finish the basics" />
          <Card className="mt-3">
            <div className="divide-y divide-border">
              <Link to="/teachers">
                <ListRow icon={<UserSquare2 className="size-4" />} title="Faculty" subtitle="Add teachers and assign classes" interactive />
              </Link>
              <Link to="/students">
                <ListRow icon={<Users className="size-4" />} title="Students" subtitle="Invite students or share a class link" interactive />
              </Link>
              <Link to="/content">
                <ListRow icon={<Library className="size-4" />} title="Shared library" subtitle="Upload institution teaching files" interactive />
              </Link>
              <Link to="/settings">
                <ListRow icon={<Clock className="size-4" />} title="Branding & theme" subtitle="Logo, campus details, appearance" interactive />
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

function Dashboard() {
  const { isAdmin } = useApp();
  return (
    <AppShell title="Home" mobileHeader="brand">
      {isAdmin ? <AdminHome /> : <TeacherHome />}
    </AppShell>
  );
}
