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
    <AppShell title="Profile" mobileHeader="none">
      <div className="space-y-6">
        {/* Profile header */}
        <Card>
          <div className="flex items-start gap-4 p-4 pb-3.5">
            <Avatar name={user.name} size="lg" className="size-16 text-lg" />
            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className="display truncate text-[22px] font-semibold leading-tight text-foreground">
                {user.name}
              </h1>
              <p className="mt-0.5 truncate text-[13px] font-medium text-muted-foreground">
                {user.title}
              </p>
              <p className="mt-1 truncate text-[12px] text-muted-foreground">
                {INSTITUTION.name} · {INSTITUTION.area}
              </p>
            </div>
            <Link
              to="/settings"
              aria-label="Edit profile"
              className="press inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 pb-4">
            <a
              href={`mailto:${user.email}`}
              className="inline-flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground"
            >
              <Mail className="size-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </a>
            {teacher?.phone && (
              <a
                href={`tel:${teacher.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 text-[12px] tabular-nums text-muted-foreground"
              >
                <Phone className="size-3.5 shrink-0" />
                {teacher.phone}
              </a>
            )}
          </div>

          {isAdmin ? (
            <TagBlock label="Role">
              <Tag label={user.title} tone="ev-1" />
              <Tag label={`Plan · ${INSTITUTION.plan}`} />
              <Tag label={`${classes.length} classes`} />
            </TagBlock>
          ) : (
            <>
              {mySubjects.length > 0 && (
                <TagBlock label="My subjects">
                  {mySubjects.map((subject) => (
                    <Tag key={subject} label={subject} tone={toneFor(subject)} />
                  ))}
                  {teacher?.department && <Tag label={`${teacher.department} dept.`} />}
                </TagBlock>
              )}
              {myClasses.length > 0 && (
                <TagBlock label="My classes">
                  {myClasses.map((cls) => (
                    <Tag
                      key={cls.id}
                      label={cls.name.replace(" — ", " · ")}
                      tone={toneFor(cls.id)}
                      {...(cls.id === classTeacherOf ? { note: "Class teacher" } : {})}
                    />
                  ))}
                </TagBlock>
              )}
            </>
          )}
        </Card>

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
