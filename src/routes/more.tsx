import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Compass,
  FileText,
  LayoutGrid,
  LifeBuoy,
  ListChecks,
  LogOut,
  Moon,
  NotebookPen,
  Presentation,
  Settings,
  StickyNote,
  Sun,
  UserSquare2,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import { Avatar, Card, ListRow, Pill } from "@/components/aarth/primitives";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "More — Aarth Educator" },
      {
        name: "description",
        content: "All Aarth Educator tools: teaching, workspace and account settings.",
      },
      { property: "og:title", content: "More — Aarth Educator" },
      { property: "og:description", content: "Every Aarth tool in one menu." },
    ],
  }),
  component: More,
});

type Item = { label: string; to: string; icon: typeof FileText; badge?: string };

const TEACHING: Item[] = [
  { label: "Study Material", to: "/aidocs", icon: FileText },
  { label: "Quizzes", to: "/quizzes", icon: ClipboardList },
  { label: "Question Papers", to: "/papers", icon: NotebookPen, badge: "Desktop editor" },
  { label: "Presentations", to: "/presentations", icon: Presentation, badge: "Desktop editor" },
  { label: "Assignments", to: "/assignments", icon: LayoutGrid, badge: "Plan" },
  { label: "Notes", to: "/notes", icon: StickyNote },
];

const WORKSPACE: Item[] = [
  { label: "Curriculum", to: "/curriculum", icon: Compass },
  { label: "Class Planner", to: "/class-planner", icon: ListChecks, badge: "Plan" },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Academic Textbooks", to: "/textbooks", icon: BookOpen },
  { label: "Students", to: "/students", icon: Users },
  { label: "Teachers", to: "/teachers", icon: UserSquare2 },
  { label: "Analytics", to: "/analytics", icon: BarChart3, badge: "Plan" },
];

const ACCOUNT: Item[] = [
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Help & support", to: "/help", icon: LifeBuoy },
];

function Group({ label, items }: { label: string; items: Item[] }) {
  return (
    <section>
      <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <Card>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <Link key={item.to} to={item.to}>
              <ListRow
                icon={<item.icon className="size-4" />}
                title={item.label}
                trailing={item.badge ? <Pill tone="outline">{item.badge}</Pill> : undefined}
                onClick={() => {}}
              />
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
}

function More() {
  const { user, role, setRole, resolvedTheme, setTheme } = useApp();
  return (
    <AppShell title="More">
      <div className="space-y-6">
        <Card className="flex items-center gap-3 p-4">
          <Avatar name={user.name} size="lg" className="size-12 text-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Pill tone="tint">{user.title}</Pill>
        </Card>

        <Card>
          <ListRow
            icon={resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            title={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            subtitle="Appearance for this device"
            showChevron={false}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          />
          <div className="border-t border-border px-4 py-3">
            <p className="text-xs font-semibold text-foreground">Preview role</p>
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
        </Card>

        <Group label="Teaching" items={TEACHING} />
        <Group label="Workspace" items={WORKSPACE} />
        <Group label="Account" items={ACCOUNT} />

        <Link to="/auth">
          <Card interactive className="flex min-h-[3.5rem] items-center gap-3 px-4">
            <LogOut className="size-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">Sign out</span>
          </Card>
        </Link>
      </div>
    </AppShell>
  );
}
