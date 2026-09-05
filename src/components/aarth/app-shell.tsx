import { useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  CircleUser,
  ClipboardList,
  Compass,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  LayoutGrid,
  LifeBuoy,
  Library,
  ListChecks,
  LogOut,
  
  Moon,
  NotebookPen,
  Plus,
  Presentation,
  Search,
  Settings,
  Sparkles,
  Sun,
  Users,
  UserSquare2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import { INSTITUTION, notifications } from "@/data/mock";
import { Avatar, IconButton, Pill } from "./primitives";
import { CreateSheet } from "./create-sheet";


type NavItem = {
  label: string;
  to: string;
  icon: typeof Home;
  roles?: ("admin" | "teacher")[];
  gated?: boolean;
};

type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Home", to: "/dashboard", icon: Home },
      { label: "Classes", to: "/classes", icon: GraduationCap },
      { label: "Class Planner", to: "/class-planner", icon: ListChecks, roles: ["teacher"], gated: true },
      { label: "Calendar", to: "/calendar", icon: CalendarDays, roles: ["teacher"] },
      { label: "Analytics", to: "/analytics", icon: BarChart3, roles: ["admin"], gated: true },
    ],
  },
  {
    label: "Teach",
    items: [
      { label: "Quizzes", to: "/quizzes", icon: ClipboardList, roles: ["teacher"] },
      { label: "Question Papers", to: "/papers", icon: NotebookPen, roles: ["teacher"] },
      { label: "Presentations", to: "/presentations", icon: Presentation, roles: ["teacher"] },
      { label: "Notes", to: "/notes", icon: FolderOpen, roles: ["teacher"] },
      { label: "Curriculum", to: "/curriculum", icon: Compass, roles: ["teacher"] },
    ],
  },

  {
    label: "Library",
    items: [
      { label: "Library", to: "/content", icon: Library },
      { label: "Academic Textbooks", to: "/textbooks", icon: BookOpen },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Students", to: "/students", icon: Users },
      { label: "Teachers", to: "/teachers", icon: UserSquare2 },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Notifications", to: "/notifications", icon: Bell },
      { label: "Settings", to: "/settings", icon: Settings },
      { label: "Help", to: "/help", icon: LifeBuoy },
    ],
  },
];

const TABS: { label: string; to: string; icon: typeof Home }[] = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Classes", to: "/classes", icon: GraduationCap },
  { label: "Create", to: "", icon: Plus },
  { label: "Library", to: "/content", icon: Library },
  { label: "Profile", to: "/more", icon: CircleUser },
];

const unread = notifications.filter((n) => !n.read).length;

function useVisibleNav() {
  const { isAdmin } = useApp();
  return NAV.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.roles || item.roles.includes(isAdmin ? "admin" : "teacher"),
    ),
  })).filter((group) => group.items.length > 0);
}

function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}

/* ---------------- Desktop sidebar ---------------- */

function Sidebar({ onCreate }: { onCreate: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const groups = useVisibleNav();
  const { user, isAdmin, theme, setTheme, resolvedTheme } = useApp();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
        collapsed ? "w-[76px]" : "w-[268px]",
      )}
      style={{ transition: "width 160ms cubic-bezier(0.4,0,0.2,1)" }}
    >
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
          {INSTITUTION.logoInitials}
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="display truncate text-[15px] text-sidebar-foreground">Aarth Educator</p>
            <p className="truncate text-[11px] text-sidebar-foreground/50">Management Portal</p>
          </div>
        )}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((v) => !v)}
          className="press inline-flex size-9 items-center justify-center rounded-xl text-sidebar-foreground/60 hover:bg-white/10 hover:text-sidebar-foreground"
        >
          <ChevronLeft className={cn("size-4", collapsed && "rotate-180")} />
        </button>
      </div>

      <div className="px-3 py-3">
        {isAdmin ? (
          <Link
            to="/classes"
            className={cn(
              "press flex h-10 items-center justify-center gap-2 rounded-xl bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground hover:opacity-90",
              collapsed && "px-0",
            )}
          >
            <Plus className="size-4" />
            {!collapsed && "Create New Class"}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onCreate}
            aria-label="Create"
            className={cn(
              "press flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground hover:opacity-90",
              collapsed && "px-0",
            )}
          >
            <Sparkles className="size-4" />
            {!collapsed && "Create"}
          </button>
        )}
      </div>


      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="px-2 pb-1.5 eyebrow text-sidebar-foreground/40">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(`${item.to}/`));
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      title={item.label}
                      className={cn(
                        "flex h-10 items-center gap-2.5 rounded-xl px-2.5 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/65 hover:bg-white/5 hover:text-sidebar-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.to === "/notifications" && unread > 0 && (
                        <span className="rounded-full bg-sidebar-primary px-1.5 py-0.5 text-[10px] font-bold text-sidebar-primary-foreground">
                          {unread}
                        </span>
                      )}
                      {!collapsed && item.gated && (
                        <span className="rounded-full border border-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-foreground/50">
                          Plan
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className={cn(
            "press mb-2 flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-[13px] font-medium text-sidebar-foreground/65 hover:bg-white/5 hover:text-sidebar-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {!collapsed && (resolvedTheme === "dark" ? "Light mode" : "Dark mode")}
        </button>
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[11px] font-bold text-sidebar-foreground">
            {user.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/50">{user.email}</p>
            </div>
          )}
          {!collapsed && (
            <Link
              to="/auth"
              aria-label="Sign out"
              className="press inline-flex size-9 items-center justify-center rounded-xl text-sidebar-foreground/60 hover:bg-white/10 hover:text-sidebar-foreground"
            >
              <LogOut className="size-4" />
            </Link>
          )}
        </div>
      </div>

    </aside>
  );
}

/* ---------------- Top bar (desktop) ---------------- */

function TopBar({ title }: { title: string }) {
  const { user, role, setRole } = useApp();
  return (
    <header className="sticky top-0 z-20 hidden h-14 items-center gap-3 border-b border-border bg-background/85 px-6 backdrop-blur md:flex">
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <label className="ml-auto flex h-9 w-64 items-center gap-2 rounded-xl border border-border bg-card px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          placeholder="Search classes, students, material"
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
      </label>
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as typeof role)}
        aria-label="Preview role"
        className="h-9 rounded-xl border border-border bg-card px-2 text-xs font-semibold text-muted-foreground outline-none"
      >
        <option value="teacher">Teacher view</option>
        <option value="admin">Admin view</option>
        <option value="super_admin">Super admin view</option>
      </select>
      <Link
        to="/notifications"
        aria-label="Notifications"
        className="press relative inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
        )}
      </Link>
      <Link to="/settings" aria-label="Your profile">
        <Avatar name={user.name} size="sm" />
      </Link>
    </header>
  );
}

/* ---------------- Phone chrome ---------------- */

export function InstitutionMark({ size = 36 }: { size?: number }) {
  if (INSTITUTION.logoUrl) {
    return (
      <img
        src={INSTITUTION.logoUrl}
        alt={`${INSTITUTION.name} logo`}
        width={size}
        height={size}
        className="shrink-0 rounded-xl border border-border object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-primary-foreground"
      style={{ width: size, height: size }}
      aria-label={INSTITUTION.name}
    >
      {INSTITUTION.logoInitials}
    </span>
  );
}

function MobileTopBar({
  title,
  back,
  variant = "default",
}: {
  title: string;
  back?: boolean | undefined;
  variant?: "default" | "brand" | "none";
}) {
  if (variant === "none") return null;
  const router = useRouter();
  const { user } = useApp();

  if (variant === "brand") {
    return (
      <header
        className="sticky top-0 z-20 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:hidden"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <InstitutionMark />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-tight text-foreground">
            {INSTITUTION.name}
          </p>
          <p className="truncate text-[11px] leading-tight text-muted-foreground">
            {INSTITUTION.area}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="press relative inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground"
          >
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
            )}
          </Link>
          <Link to="/settings" aria-label="Your profile" className="press p-0.5">
            <Avatar name={user.name} size="sm" />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {back ? (
        <IconButton label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-5" />
        </IconButton>
      ) : (
        <Link to="/settings" aria-label="Your profile" className="p-1.5">
          <Avatar name={user.name} size="sm" />
        </Link>
      )}
      <p className="flex-1 truncate text-center text-sm font-semibold text-foreground">{title}</p>
      <Link
        to="/notifications"
        aria-label="Notifications"
        className="press relative inline-flex size-11 items-center justify-center rounded-xl text-muted-foreground"
      >
        <Bell className="size-5" />
        {unread > 0 && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary" />}
      </Link>
    </header>
  );
}


function BottomTabs({ onCreate }: { onCreate: () => void }) {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch px-2 pt-1">
        {TABS.map((tab) => {
          const active = pathname === tab.to;
          if (tab.label === "Create") {
            return (
              <li key="create" className="flex flex-1 justify-center">
                <button
                  type="button"
                  onClick={onCreate}
                  aria-label="Create"
                  className="press -mt-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-raised)] ring-4 ring-background transition-transform active:scale-95"
                >
                  <Plus className="size-6" strokeWidth={2.5} />
                </button>
              </li>
            );
          }

          return (
            <li key={tab.to} className="flex-1">
              <Link
                to={tab.to}
                className={cn(
                  "relative flex min-h-[3.5rem] flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className={cn("size-5 transition-transform", active && "scale-110")} />
                {tab.label}
                {active && (
                  <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------------- Shell ---------------- */

export function AppShell({
  title,
  back,
  children,
  wide,
  mobileHeader = "default",
}: {
  title: string;
  back?: boolean | undefined;
  children: ReactNode;
  wide?: boolean | undefined;
  mobileHeader?: "default" | "brand" | "none";
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = () => setCreateOpen(true);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar onCreate={openCreate} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />
        <MobileTopBar title={title} back={back} variant={mobileHeader} />

        <main
          className={cn(
            "mx-auto w-full flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-12 md:pt-8",
            wide ? "max-w-[1400px]" : "max-w-6xl",
          )}
        >
          {children}
        </main>
        <BottomTabs onCreate={openCreate} />
      </div>
      <CreateSheet open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}


export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 hidden items-center gap-3 sm:flex">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              {INSTITUTION.logoInitials}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Aarth Educator</p>
              <p className="text-[11px] text-muted-foreground">Management Portal</p>
            </div>
          </div>
          {children}
        </div>
      </div>
      <footer className="px-5 py-6 sm:border-t sm:border-border sm:px-4 sm:py-5">
        <div className="mx-auto flex max-w-md flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span>© 2026 Aarth</span>
          <div className="flex gap-4">
            <Link to="/help">Contact</Link>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { NAV, X };
