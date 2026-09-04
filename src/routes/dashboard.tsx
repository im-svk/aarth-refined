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
            onClick={() => {}}
          />
        </Link>
      ))}
    </div>
  );
}

function TeacherHome() {
  const featured = active[3]!;
  return (
    <div className="space-y-8">
      <PageHeader
        kicker={todayLabel}
        title={
          <>
            {greeting()}, <em className="text-primary">Ananya</em>
          </>
        }
        subtitle="Two classes today and one paper waiting on you."
      />

      <Card accent className="p-5 pl-6 md:p-7 md:pl-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <Pill tone="tint">Next up · 09:15 IST</Pill>
            <h2 className="display mt-3 text-2xl text-foreground md:text-3xl">{featured.name}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Physics · Laws of Motion · Lab 2 · {featured.studentCount} students
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/classes/$classId" params={{ classId: featured.id }}>
              <Button>
                Open class <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/aidocs">
              <Button variant="outline">Create study material</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/quizzes" className="press">
          <Card interactive className="h-full p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-tint text-tint-foreground">
              <ClipboardList className="size-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">Generate quiz</p>
            <p className="mt-1 text-xs text-muted-foreground">AI questions from a chapter</p>
          </Card>
        </Link>
        <Link to="/aidocs" className="press">
          <Card interactive className="h-full p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-tint text-tint-foreground">
              <FileText className="size-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">Study notes</p>
            <p className="mt-1 text-xs text-muted-foreground">A4 document studio</p>
          </Card>
        </Link>
        <StatTile label="To grade" value="12" hint="Across 2 classes" icon={<Layers className="size-4" />} />
        <StatTile
          label="Total students"
          value={active.reduce((sum, c) => sum + c.studentCount, 0)}
          hint="Assigned to you"
          icon={<Users className="size-4" />}
        />
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

        <div className="space-y-6">
          <section>
            <SectionHeader title="Today's schedule" hint={todayLabel} />
            <Card className="mt-3 p-4">
              <ol className="space-y-3">
                {todaySchedule.map((item, index) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="flex w-12 shrink-0 flex-col items-end">
                      <span className="text-xs font-semibold text-foreground">{item.time}</span>
                      {index === 0 && <span className="text-[10px] text-primary">Now</span>}
                    </div>
                    <span
                      className={`mt-1 h-full w-[2px] shrink-0 rounded-full ${
                        index === 0 ? "bg-primary" : "bg-border"
                      }`}
                    />
                    <div className="min-w-0 pb-1">
                      <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {className(item.classId)} · {item.room}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </section>

          <section>
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
                      onClick={() => {}}
                    />
                  </Link>
                ))}
              </div>
            </Card>
          </section>
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
                <ListRow icon={<UserSquare2 className="size-4" />} title="Faculty" subtitle="Add teachers and assign classes" onClick={() => {}} />
              </Link>
              <Link to="/students">
                <ListRow icon={<Users className="size-4" />} title="Students" subtitle="Invite students or share a class link" onClick={() => {}} />
              </Link>
              <Link to="/content">
                <ListRow icon={<Library className="size-4" />} title="Shared library" subtitle="Upload institution teaching files" onClick={() => {}} />
              </Link>
              <Link to="/settings">
                <ListRow icon={<Clock className="size-4" />} title="Branding & theme" subtitle="Logo, campus details, appearance" onClick={() => {}} />
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
