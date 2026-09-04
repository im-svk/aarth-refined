import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
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
      <PageHeader
        kicker={todayLabel}
        title={
          <>
            {greeting()}, <em className="text-primary">Ananya</em>
          </>
        }
        subtitle="Two classes today and one paper waiting on you."
      />

      {/* Bento grid */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-12">
        {/* Today's schedule — anchor tile */}
        <Card className="p-5 lg:col-span-8 lg:row-span-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="display text-lg text-foreground">Today's classes</h3>
            <Pill tone="outline">{todayLabel}</Pill>
          </div>
          <ol className="mt-4 space-y-2">
            {todaySchedule.map((item, index) => (
              <li
                key={item.id}
                className={
                  index === 0
                    ? "flex items-center gap-4 rounded-xl border-l-[3px] border-primary bg-muted/60 p-3.5"
                    : "flex items-center gap-4 rounded-xl border border-border p-3.5"
                }
              >
                <div className="w-14 shrink-0">
                  <p className="display text-base text-foreground">{item.time}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">IST</p>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {className(item.classId)} · {item.room}
                  </p>
                </div>
                {index === 0 && (
                  <Link
                    to="/classes/$classId"
                    params={{ classId: featured.id }}
                    className="hidden shrink-0 sm:block"
                  >
                    <Button size="sm">Open class</Button>
                  </Link>
                )}

              </li>
            ))}
          </ol>
        </Card>

        {/* Next up — dark navy tile */}
        <div className="rounded-3xl bg-sidebar p-6 text-sidebar-foreground lg:col-span-4">
          <p className="eyebrow text-sidebar-foreground/50">
            Next up · 09:15 IST
          </p>
          <h2 className="display mt-2 text-2xl text-sidebar-foreground">{featured.name}</h2>
          <p className="mt-1.5 text-sm text-sidebar-foreground/60">
            Physics · Laws of Motion · Lab 2 · {featured.studentCount} students
          </p>
          <Link to="/aidocs">
            <span className="press mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground hover:opacity-90">
              Create study material <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-4">
          <StatTile
            label="To grade"
            value="12"
            hint="Across 2 classes"
            icon={<Layers className="size-4" />}
          />
          <StatTile
            label="Students"
            value={active.reduce((sum, c) => sum + c.studentCount, 0)}
            hint="Assigned to you"
            icon={<Users className="size-4" />}
          />
        </div>

        {/* Active classes */}
        <section className="lg:col-span-7">
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

        {/* Continue working */}
        <section className="lg:col-span-5">
          <SectionHeader
            title="Continue working"
            action={
              <Link to="/aidocs" className="text-xs font-semibold text-primary">
                View all
              </Link>
            }
          />
          <Card className="mt-3">
            <div className="divide-y divide-border">
              {aiDocuments.slice(0, 3).map((doc) => (
                <Link key={doc.id} to="/aidocs">
                  <ListRow
                    icon={<FileText className="size-4" />}
                    title={doc.title}
                    subtitle={`${doc.subject} · ${relativeTime(doc.updatedAt)}`}
                    interactive
                  />
                </Link>
              ))}
            </div>
          </Card>
        </section>

        {/* Quick actions strip */}
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-12">
          {[
            { to: "/quizzes", icon: ClipboardList, label: "New quiz", hint: "AI from a chapter" },
            { to: "/aidocs", icon: FileText, label: "Study notes", hint: "A4 document studio" },
            { to: "/content", icon: Library, label: "Upload material", hint: "Shared library" },
          ].map((action) => (
            <Link key={action.to} to={action.to} className="press">
              <Card interactive className="flex h-full items-center gap-3 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground">
                  <action.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.hint}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
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
  return <AppShell title="Home">{isAdmin ? <AdminHome /> : <TeacherHome />}</AppShell>;
}
