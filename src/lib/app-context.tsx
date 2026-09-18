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

export type TeacherProfile = {
  name: string;
  email: string;
  inviteCode: string;
  institution: string;
  subjects: string[];
  classCodes: string[];
};

export type AppUser = {
  name: string;
  email: string;
  role: Role;
  title: string;
};

const DEFAULT_PROFILE: TeacherProfile = {
  name: "Ananya Krishnan",
  email: "ananya.krishnan@sringeri.edu.in",
  inviteCode: "SV-2026-TEACH",
  institution: "Sringeri Vidya Mandir",
  subjects: ["Physics", "Science"],
  classCodes: ["SV-11A", "SV-10A"],
};

const USERS: Record<Role, AppUser> = {
  teacher: {
    name: DEFAULT_PROFILE.name,
    email: DEFAULT_PROFILE.email,
    role: "teacher",
    title: "Faculty · Notes AI",
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
  teacherProfile: TeacherProfile;
  setTeacherProfile: (profile: TeacherProfile) => void;
  clearTeacherProfile: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
  isStaff: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
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

function safeProfile(raw: string | null): TeacherProfile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<TeacherProfile>;
    if (!parsed.name || !parsed.inviteCode || !parsed.institution) return null;
    return {
      name: parsed.name,
      email: parsed.email || DEFAULT_PROFILE.email,
      inviteCode: parsed.inviteCode,
      institution: parsed.institution,
      subjects: parsed.subjects?.length ? parsed.subjects : DEFAULT_PROFILE.subjects,
      classCodes: parsed.classCodes?.length ? parsed.classCodes : DEFAULT_PROFILE.classCodes,
    };
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("teacher");
  const [teacherProfile, setTeacherProfileState] = useState<TeacherProfile>(DEFAULT_PROFILE);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [planEnabled, setPlanEnabled] = useState(false);

  useEffect(() => {
    const storedRole = window.localStorage.getItem("aarth.role") as Role | null;
    const storedTheme = window.localStorage.getItem("aarth.theme") as ThemeMode | null;
    const storedProfile = safeProfile(window.localStorage.getItem("aarth.teacherProfile"));
    if (storedRole) setRoleState(storedRole);
    if (storedTheme) setThemeState(storedTheme);
    if (storedProfile) setTeacherProfileState(storedProfile);
    setResolvedTheme(applyTheme(storedTheme ?? "light"));
  }, []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    window.localStorage.setItem("aarth.role", next);
  }, []);

  const setTeacherProfile = useCallback((next: TeacherProfile) => {
    setTeacherProfileState(next);
    setRoleState("teacher");
    window.localStorage.setItem("aarth.role", "teacher");
    window.localStorage.setItem("aarth.teacherProfile", JSON.stringify(next));
  }, []);

  const clearTeacherProfile = useCallback(() => {
    setTeacherProfileState(DEFAULT_PROFILE);
    window.localStorage.removeItem("aarth.teacherProfile");
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    window.localStorage.setItem("aarth.theme", next);
    setResolvedTheme(applyTheme(next));
  }, []);

  const user = useMemo<AppUser>(() => {
    if (role !== "teacher") return USERS[role];
    return {
      name: teacherProfile.name,
      email: teacherProfile.email,
      role: "teacher",
      title: `${teacherProfile.subjects[0] ?? "Teacher"} · Notes AI`,
    };
  }, [role, teacherProfile]);

  const value = useMemo<AppContextValue>(
    () => ({
      role,
      setRole,
      user,
      teacherProfile,
      setTeacherProfile,
      clearTeacherProfile,
      theme,
      setTheme,
      resolvedTheme,
      isStaff: true,
      isAdmin: role === "admin" || role === "super_admin",
      isTeacher: role === "teacher",
      planEnabled,
      setPlanEnabled,
    }),
    [
      role,
      setRole,
      user,
      teacherProfile,
      setTeacherProfile,
      clearTeacherProfile,
      theme,
      setTheme,
      resolvedTheme,
      planEnabled,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
