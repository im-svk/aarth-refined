import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, KeyRound, School, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "./app-shell";
import { Button, Spinner } from "./primitives";
import { cn } from "@/lib/utils";
import { useApp, type TeacherProfile } from "@/lib/app-context";
import { INSTITUTION } from "@/data/mock";

export const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50";

function GroupField({
  label,
  error,
  children,
  last,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("px-4 py-3", !last && "border-b border-primary/10")}>
      <label className="block">
        <span className="block text-[11px] font-medium text-primary/70">{label}</span>
        {children}
      </label>
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </div>
  );
}

const bareInput =
  "mt-0.5 w-full border-0 bg-transparent p-0 text-[15px] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/70";

const INVITE_PROFILES: Record<string, TeacherProfile> = {
  "SV-2026-TEACH": {
    name: "Ananya Krishnan",
    email: "ananya.krishnan@sringeri.edu.in",
    inviteCode: "SV-2026-TEACH",
    institution: INSTITUTION.name,
    subjects: ["Physics", "Science"],
    classCodes: ["SV-11A", "SV-10A"],
  },
  "SV-PHY-11A": {
    name: "Meera Nair",
    email: "meera.nair@sringeri.edu.in",
    inviteCode: "SV-PHY-11A",
    institution: INSTITUTION.name,
    subjects: ["Physics"],
    classCodes: ["SV-11A"],
  },
};

function normaliseCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "-");
}

function WorkspaceIllustration() {
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="login-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ev-1-bg)" />
          <stop offset="100%" stopColor="var(--ev-1)" stopOpacity="0.24" />
        </linearGradient>
      </defs>
      <rect x="16" y="18" width="188" height="104" rx="24" fill="url(#login-card)" />
      <rect x="46" y="36" width="70" height="86" rx="12" fill="var(--card)" stroke="var(--ev-1)" strokeWidth="2" />
      <path d="M60 58h42M60 72h34M60 86h42" stroke="var(--ev-1)" strokeWidth="4" strokeLinecap="round" opacity="0.28" />
      <rect x="126" y="48" width="50" height="50" rx="14" fill="var(--card)" stroke="var(--ev-2)" strokeWidth="2" />
      <path d="M151 61v24M139 73h24" stroke="var(--ev-2)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="170" cy="38" r="12" fill="var(--ev-4)" />
      <path d="m170 31 1.6 4.3 4.4 1.6-4.4 1.6-1.6 4.5-1.6-4.5-4.4-1.6 4.4-1.6z" fill="var(--card)" />
      <rect x="70" y="104" width="92" height="10" rx="5" fill="var(--ev-1)" opacity="0.18" />
    </svg>
  );
}

export function LoginScreen() {
  const navigate = useNavigate();
  const { setTeacherProfile } = useApp();
  const [inviteCode, setInviteCode] = useState("SV-2026-TEACH");
  const [teacherName, setTeacherName] = useState("Ananya Krishnan");
  const [subject, setSubject] = useState("Physics");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ inviteCode?: string; teacherName?: string }>({});

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const code = normaliseCode(inviteCode);
    const next: typeof errors = {};
    if (code.length < 6) next.inviteCode = "Enter the code shared by your university";
    if (teacherName.trim().length < 2) next.teacherName = "Enter your name";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const matched = INVITE_PROFILES[code];
    const profile: TeacherProfile = matched ?? {
      name: teacherName.trim(),
      email: `${teacherName.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") || "teacher"}@demo.aarth.app`,
      inviteCode: code,
      institution: INSTITUTION.name,
      subjects: [subject.trim() || "General"],
      classCodes: [`${code.split("-")[0] || "CLS"}-NOTES`],
    };

    setBusy(true);
    setTimeout(() => {
      setTeacherProfile(profile);
      setBusy(false);
      toast.success("Workspace ready", {
        description: `${profile.institution} is connected to your teacher code.`,
      });
      navigate({ to: "/dashboard" });
    }, 650);
  }

  return (
    <AuthLayout>
      <div className="grid gap-6 sm:hairline-card sm:p-6">
        <div className="rounded-3xl border border-border bg-tint/60 p-4">
          <WorkspaceIllustration />
        </div>

        <div className="text-center sm:text-left">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:mx-0">
            <KeyRound className="size-5" />
          </span>
          <h1 className="display mt-4 text-[1.75rem] leading-tight text-foreground sm:text-[2.05rem]">
            Teacher code login
          </h1>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Enter the university code once. Your notes and AI study material stay organised by subject and class.
          </p>
        </div>

        <form onSubmit={submit}>
          <div className="overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 shadow-sm dark:bg-primary/10">
            <GroupField label="University teacher code" {...(errors.inviteCode ? { error: errors.inviteCode } : {})}>
              <div className="flex items-center gap-2">
                <School className="size-4 shrink-0 text-primary" />
                <input
                  autoComplete="one-time-code"
                  value={inviteCode}
                  onChange={(event) => setInviteCode(event.target.value)}
                  placeholder="SV-2026-TEACH"
                  className={bareInput}
                />
              </div>
            </GroupField>
            <GroupField label="Your name" {...(errors.teacherName ? { error: errors.teacherName } : {})}>
              <div className="flex items-center gap-2">
                <UserRound className="size-4 shrink-0 text-primary" />
                <input
                  autoComplete="name"
                  value={teacherName}
                  onChange={(event) => setTeacherName(event.target.value)}
                  placeholder="Teacher name"
                  className={bareInput}
                />
              </div>
            </GroupField>
            <GroupField label="Primary subject" last>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 shrink-0 text-primary" />
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Physics"
                  className={bareInput}
                />
              </div>
            </GroupField>
          </div>

          <Button type="submit" disabled={busy} className="mt-6 h-12 w-full rounded-full text-[15px]">
            {busy ? <Spinner className="size-4 text-primary-foreground" /> : "Open teacher workspace"}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Preview code ready</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Use <span className="font-mono text-foreground">SV-2026-TEACH</span> to enter the demo workspace.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-muted-foreground">
          Students do not need an account. Share a class code from the workspace.
        </p>
        <p className="sr-only">
          <Link to="/register">Institution registration</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
