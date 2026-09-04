import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Info,
  LifeBuoy,
  LogOut,
  Mail,
  Moon,
  Pencil,
  Phone,
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

function Tag({ label, tone, note }: { label: string; tone?: string; note?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold",
        tone ? "" : "bg-muted text-muted-foreground",
      )}
      style={
        tone
          ? {
              backgroundColor: `color-mix(in oklab, var(--${tone}) 12%, var(--card))`,
              color: `var(--${tone})`,
            }
          : undefined
      }
    >
      {label}
      {note && (
        <span className="rounded-full bg-card/70 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.06em]">
          {note}
        </span>
      )}
    </span>
  );
}

function TagBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border px-4 py-3.5">
      <p className="eyebrow pb-2 text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
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
        {/* Profile header */}
        <Card className="relative">
          <Link
            to="/settings"
            aria-label="Edit profile"
            className="press absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <Pencil className="size-4" />
          </Link>

          <div className="flex flex-col items-center px-6 pb-5 pt-7 text-center">
            <Avatar
              name={user.name}
              className="size-24 text-[1.75rem] font-semibold shadow-[var(--shadow-raised)]"
            />
            <h1 className="display mt-4 text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground">
              {user.name}
            </h1>
            <p className="mt-1 text-[0.9375rem] font-medium text-primary">{user.title}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {INSTITUTION.name} · {INSTITUTION.area}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <a
                href={`mailto:${user.email}`}
                className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground"
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

            <Link
              to="/settings"
              className="press mt-5 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-semibold text-primary-foreground"
            >
              <Pencil className="size-3.5" />
              Edit profile
            </Link>
          </div>
        </Card>

        {isAdmin ? (
          <Card className="p-4">
            <p className="eyebrow pb-2 text-muted-foreground">Role</p>
            <div className="flex flex-wrap gap-1.5">
              <Tag label={user.title} tone="ev-1" />
              <Tag label={`Plan · ${INSTITUTION.plan}`} />
              <Tag label={`${classes.length} classes`} />
            </div>
          </Card>
        ) : (
          <>
            {mySubjects.length > 0 && (
              <Card className="p-4">
                <p className="eyebrow pb-2 text-muted-foreground">My subjects</p>
                <div className="flex flex-wrap gap-1.5">
                  {mySubjects.map((subject) => (
                    <Tag key={subject} label={subject} tone={toneFor(subject)} />
                  ))}
                  {teacher?.department && <Tag label={`${teacher.department} dept.`} />}
                </div>
              </Card>
            )}
            {myClasses.length > 0 && (
              <Card className="p-4">
                <p className="eyebrow pb-2 text-muted-foreground">My classes</p>
                <div className="flex flex-wrap gap-1.5">
                  {myClasses.map((cls) => (
                    <Tag
                      key={cls.id}
                      label={cls.name.replace(" — ", " · ")}
                      tone={toneFor(cls.id)}
                      {...(cls.id === classTeacherOf ? { note: "Class teacher" } : {})}
                    />
                  ))}
                </div>
              </Card>
            )}
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
