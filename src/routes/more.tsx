import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Info,
  LifeBuoy,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Pencil,
  Phone,
  School,
  Settings,
  Sun,
  Users,
  UserSquare2,
} from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import { Avatar, Card, ListRow } from "@/components/aarth/primitives";
import { INSTITUTION, classes, teachers } from "@/data/mock";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "Profile — Aarth Educator" },
      {
        name: "description",
        content:
          "Your Aarth Educator profile: subjects, classes, directories, notification settings and support.",
      },
      { property: "og:title", content: "Profile — Aarth Educator" },
      {
        property: "og:description",
        content: "Your teaching profile, directories and account settings in one place.",
      },
    ],
  }),
  component: Profile,
});

const TONES = ["ev-1", "ev-2", "ev-3", "ev-4", "ev-5"] as const;

function toneFor(value: string) {
  let sum = 0;
  for (const ch of value) sum += ch.charCodeAt(0);
  return TONES[sum % TONES.length]!;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ToneTag({
  label,
  tone,
  icon,
  note,
}: {
  label: string;
  tone?: string;
  icon?: React.ReactNode;
  note?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold",
        tone ? "" : "bg-muted text-muted-foreground",
      )}
      style={
        tone
          ? {
              backgroundColor: `color-mix(in oklab, var(--${tone}-bg) 70%, var(--card))`,
              color: `var(--${tone})`,
            }
          : undefined
      }
    >
      {icon && <span className="shrink-0 opacity-80">{icon}</span>}
      <span className="truncate">{label}</span>
      {note && (
        <span className="rounded-full bg-card/70 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.06em]">
          {note}
        </span>
      )}
    </span>
  );
}

function SectionCard({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3 pb-3">
        <h2 className="text-[0.9375rem] font-semibold tracking-[-0.014em] text-foreground">
          {title}
        </h2>
        {typeof count === "number" && (
          <span className="rounded-full bg-tint px-2.5 py-1 text-[11px] font-bold text-tint-foreground">
            {count}
          </span>
        )}
      </div>
      {children}
    </Card>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-1">
      <span className="display text-[1.25rem] font-semibold leading-none text-foreground">
        {value}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function ProfileHeader({
  user,
  teacher,
  myClasses,
  mySubjects,
  isAdmin,
}: {
  user: ReturnType<typeof useApp>["user"];
  teacher: (typeof teachers)[number] | undefined;
  myClasses: (typeof classes)[number][];
  mySubjects: string[];
  isAdmin: boolean;
}) {
  const totalStudents = isAdmin
    ? classes.reduce((sum, c) => sum + c.studentCount, 0)
    : myClasses.reduce((sum, c) => sum + c.studentCount, 0);
  const subjectCount = isAdmin ? new Set(teachers.flatMap((t) => t.specializations)).size : mySubjects.length;
  const classCount = isAdmin ? classes.length : myClasses.length;

  return (
    <Card className="relative overflow-hidden" data-testid="profile-header">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/[0.06] blur-2xl" />
      <div className="absolute -left-8 -top-8 size-28 rounded-full bg-tint blur-2xl" />

      <div className="relative flex flex-col items-center px-6 pb-5 pt-6 text-center">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground">
              {INSTITUTION.logoInitials}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {INSTITUTION.short}
            </span>
          </div>
          <Link
            to="/settings"
            aria-label="Edit profile"
            className="press inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-[var(--shadow-card)]"
          >
            <Pencil className="size-4" />
          </Link>
        </div>

        <div className="relative mt-3">
          <Avatar
            name={user.name}
            className="size-28 text-[2.25rem] font-semibold shadow-[var(--shadow-raised)] ring-4 ring-card"
          />
          <span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
            <School className="size-3.5" />
          </span>
        </div>

        <h1 className="display mt-4 text-[1.625rem] font-semibold tracking-[-0.024em] text-foreground">
          {user.name}
        </h1>
        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-tint px-3 py-1 text-[12px] font-semibold text-tint-foreground">
          <GraduationCap className="size-3.5" />
          {user.title}
        </span>

        <p className="mt-2 flex items-center justify-center gap-1 text-[13px] text-muted-foreground">
          <MapPin className="size-3.5" />
          {INSTITUTION.name} · {INSTITUTION.area}
        </p>

        <div className="mt-5 flex w-full items-center justify-center divide-x divide-border rounded-2xl border border-border bg-card/60 px-2 py-3">
          <Stat value={String(classCount)} label={isAdmin ? "Classes" : "My classes"} />
          <Stat value={totalStudents.toLocaleString("en-IN")} label="Students" />
          <Stat value={String(subjectCount)} label={isAdmin ? "Subjects" : "My subjects"} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <a
            href={`mailto:${user.email}`}
            className="inline-flex min-w-0 max-w-[10rem] items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground"
          >
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{user.email}</span>
          </a>
          {teacher?.phone && (
            <a
              href={`tel:${teacher.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] tabular-nums font-medium text-muted-foreground"
            >
              <Phone className="size-3.5 shrink-0" />
              {teacher.phone}
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function SubjectCloud({ subjects, department }: { subjects: string[]; department?: string | undefined }) {
  return (
    <SectionCard title="My subjects" count={subjects.length}>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <ToneTag key={subject} label={subject} tone={toneFor(subject)} icon={<BookOpen className="size-3.5" />} />
        ))}
        {department && (
          <ToneTag label={`${department} department`} icon={<Users className="size-3.5" />} />
        )}
      </div>
    </SectionCard>
  );
}

function classCode(cls: (typeof classes)[number]) {
  const section = cls.stream
    ? cls.stream.slice(0, 2)
    : cls.name.split(" — ")[1]?.trim().slice(0, 2) ?? "";
  return `${cls.grade}${section}`;
}

function ClassList({ myClasses, classTeacherOf }: { myClasses: (typeof classes)[number][]; classTeacherOf?: string | undefined }) {
  return (
    <SectionCard title="My classes" count={myClasses.length}>
      <div className="space-y-2">
        {myClasses.map((cls) => {
          const tone = toneFor(cls.id);
          return (
            <Link key={cls.id} to="/classes/$classId" params={{ classId: cls.id }}>
              <div className="press flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--${tone}-bg) 80%, var(--card))`,
                    color: `var(--${tone})`,
                  }}
                >
                  {initials(cls.name)}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {cls.name.replace(" — ", " · ")}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {cls.board}
                    {cls.stream ? ` · ${cls.stream}` : ""} · {cls.academicYear}
                  </span>
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  {cls.id === classTeacherOf && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      Class teacher
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Users className="size-3.5" />
                    {cls.studentCount}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="px-1 pb-2 eyebrow text-muted-foreground">{label}</p>
      <Card>
        <div className="divide-y divide-border">{children}</div>
      </Card>
    </section>
  );
}

function Profile() {
  const { user, role, setRole, resolvedTheme, setTheme, isAdmin } = useApp();

  const teacher = teachers.find((t) => t.email === user.email);
  const myClasses = (teacher?.classIds ?? [])
    .map((id) => classes.find((c) => c.id === id))
    .filter((c): c is (typeof classes)[number] => Boolean(c));
  const mySubjects = teacher?.specializations ?? [];
  const classTeacherOf = myClasses[0]?.id;

  return (
    <AppShell title="Profile">
      <div className="space-y-5">
        <ProfileHeader
          user={user}
          teacher={teacher}
          myClasses={myClasses}
          mySubjects={mySubjects}
          isAdmin={isAdmin}
        />

        {isAdmin ? (
          <Card className="p-4">
            <p className="eyebrow pb-2 text-muted-foreground">Role</p>
            <div className="flex flex-wrap gap-2">
              <ToneTag label={user.title} tone="ev-1" icon={<GraduationCap className="size-3.5" />} />
              <ToneTag label={`Plan · ${INSTITUTION.plan}`} icon={<School className="size-3.5" />} />
              <ToneTag label={`${classes.length} classes`} icon={<Users className="size-3.5" />} />
            </div>
          </Card>
        ) : (
          <>
            {mySubjects.length > 0 && (
              <SubjectCloud subjects={mySubjects} department={teacher?.department} />
            )}
            {myClasses.length > 0 && <ClassList myClasses={myClasses} classTeacherOf={classTeacherOf} />}
          </>
        )}

        <Group label="People">
          <Link to="/students">
            <ListRow
              icon={<Users className="size-4" />}
              title="Student directory"
              subtitle="Search, invite and manage students"
              interactive
            />
          </Link>
          <Link to="/teachers">
            <ListRow
              icon={<UserSquare2 className="size-4" />}
              title="Teacher directory"
              subtitle="Faculty, departments and classes"
              interactive
            />
          </Link>
        </Group>

        <Group label="Preferences">
          <Link to="/notifications">
            <ListRow
              icon={<Bell className="size-4" />}
              title="Notification settings"
              subtitle="Alerts, reminders and digests"
              interactive
            />
          </Link>
          <ListRow
            icon={resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            title={resolvedTheme === "dark" ? "Light appearance" : "Dark appearance"}
            subtitle="Appearance for this device"
            showChevron={false}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          />
          <Link to="/settings">
            <ListRow
              icon={<Settings className="size-4" />}
              title="Account & institution settings"
              subtitle="Profile, security and institution"
              interactive
            />
          </Link>
          <div className="px-4 py-3.5">
            <p className="text-[12px] font-semibold text-foreground">Preview role</p>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as typeof role)}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none"
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Institution admin</option>
              <option value="super_admin">Super admin</option>
            </select>
          </div>
        </Group>

        <Group label="Support">
          <Link to="/help">
            <ListRow
              icon={<LifeBuoy className="size-4" />}
              title="Help & support"
              subtitle="Guides, FAQs and contact"
              interactive
            />
          </Link>
          <ListRow
            icon={<Info className="size-4" />}
            title="About Aarth"
            subtitle="Version 2.4 · Made for Indian classrooms"
            showChevron={false}
          />
        </Group>

        <Link to="/auth">
          <Card interactive className="flex min-h-[3.5rem] items-center gap-3 px-4">
            <LogOut className="size-4 text-destructive" />
            <span className="flex-1 text-sm font-semibold text-destructive">Sign out</span>
            <ChevronRight className="size-4 text-destructive/60" />
          </Card>
        </Link>
      </div>
    </AppShell>
  );
}
