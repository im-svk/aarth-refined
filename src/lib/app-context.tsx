import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "super_admin" | "admin" | "teacher";
export type ThemeMode = "light" | "dark" | "system";

export type AppUser = {
  name: string;
  email: string;
  role: Role;
  title: string;
};

const USERS: Record<Role, AppUser> = {
  teacher: {
    name: "Ananya Krishnan",
    email: "ananya.krishnan@sringeri.edu.in",
    role: "teacher",
    title: "Faculty · Science",
  },
  admin: {
    name: "Rajesh Iyer",
    email: "rajesh.iyer@sringeri.edu.in",
    role: "admin",
    title: "Institution Admin",
  },
  super_admin: {
    name: "Aarth Staff",
    email: "staff@aarth.app",
    role: "super_admin",
    title: "Platform Staff",
  },
};

type AppContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  user: AppUser;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
  isStaff: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  /** Plan-gated features (Assignments, Class Planner, Analytics). */
  planEnabled: boolean;
  setPlanEnabled: (value: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function applyTheme(mode: ThemeMode): "light" | "dark" {
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
  }
  return resolved;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("teacher");
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [planEnabled, setPlanEnabled] = useState(false);

  useEffect(() => {
    const storedRole = window.localStorage.getItem("aarth.role") as Role | null;
    const storedTheme = window.localStorage.getItem("aarth.theme") as ThemeMode | null;
    if (storedRole) setRoleState(storedRole);
    if (storedTheme) setThemeState(storedTheme);
    setResolvedTheme(applyTheme(storedTheme ?? "light"));
  }, []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    window.localStorage.setItem("aarth.role", next);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    window.localStorage.setItem("aarth.theme", next);
    setResolvedTheme(applyTheme(next));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      role,
      setRole,
      user: USERS[role],
      theme,
      setTheme,
      resolvedTheme,
      isStaff: true,
      isAdmin: role === "admin" || role === "super_admin",
      isTeacher: role === "teacher",
      planEnabled,
      setPlanEnabled,
    }),
    [role, setRole, theme, setTheme, resolvedTheme, planEnabled],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
