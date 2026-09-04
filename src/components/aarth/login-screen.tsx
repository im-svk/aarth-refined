import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "./app-shell";
import { Button, Spinner } from "./primitives";
import { cn } from "@/lib/utils";
import { INSTITUTION } from "@/data/mock";

export const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50";

/* Grouped inset field, Apple Settings style */
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
        <span className="block text-[11px] font-medium tracking-[-0.005em] text-primary/70">
          {label}
        </span>
        {children}
      </label>
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </div>
  );
}

const bareInput =
  "mt-0.5 w-full border-0 bg-transparent p-0 text-[15px] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/70";

export function LoginScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "reset" | "reset_sent">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success("Signed in", { description: "Welcome back to Aarth Educator." });
      navigate({ to: "/classes" });
    }, 900);
  }

  function sendReset(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setMode("reset_sent");
    }, 800);
  }

  return (
    <AuthLayout>
      <div className="sm:hairline-card sm:p-7">
        {mode === "login" && (
          <>
            <div className="text-center sm:text-left">
              <span className="mx-auto flex size-14 items-center justify-center rounded-[1.15rem] bg-primary text-base font-bold text-primary-foreground shadow-sm sm:hidden">
                {INSTITUTION.logoInitials}
              </span>
              <h1 className="display mt-5 text-[1.75rem] leading-tight text-foreground sm:mt-0 sm:text-[2.1rem]">
                Sign in
              </h1>
              <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
                to continue to Aarth Educator
              </p>
            </div>

            <div className="mt-7 space-y-2.5">
              <button
                type="button"
                onClick={oauth}
                disabled={busy}
                className="press flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-card text-[15px] font-semibold text-foreground shadow-sm transition-colors hover:bg-accent disabled:opacity-60"
              >
                <GoogleMark className="size-[18px]" />
                Continue with Google
              </button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                or
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit}>
              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 shadow-sm dark:bg-primary/10">
                <GroupField label="Email" {...(errors.email ? { error: errors.email } : {})}>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@institution.edu.in"
                    className={bareInput}
                  />
                </GroupField>
                <GroupField
                  label="Password"
                  last
                  {...(errors.password ? { error: errors.password } : {})}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={bareInput}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="shrink-0 text-muted-foreground"
                    >
                      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </GroupField>
              </div>

              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setMode("reset");
                }}
                className="mt-3 block text-[13px] font-semibold text-primary"
              >
                Forgot password?
              </button>

              <Button
                type="submit"
                disabled={busy}
                className="mt-6 h-12 w-full rounded-full text-[15px]"
              >
                {busy ? <Spinner className="size-4 text-primary-foreground" /> : "Sign in"}
              </Button>
            </form>

            <p className="mt-7 text-center text-[13px] text-muted-foreground">
              New institution?{" "}
              <Link to="/register" className="font-semibold text-primary">
                Create an account
              </Link>
            </p>
          </>
        )}

        {mode === "reset" && (
          <>
            <div className="text-center sm:text-left">
              <span className="mx-auto flex size-14 items-center justify-center rounded-[1.15rem] bg-tint text-tint-foreground sm:mx-0 sm:size-11 sm:rounded-xl">
                <Mail className="size-5" />
              </span>
              <h1 className="display mt-5 text-[1.6rem] leading-tight text-foreground sm:mt-4 sm:text-3xl">
                Reset your password
              </h1>
              <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
                We'll email a secure link to set a new password.
              </p>
            </div>
            <form onSubmit={sendReset} className="mt-7">
              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 shadow-sm dark:bg-primary/10">
                <GroupField label="Email" last {...(errors.email ? { error: errors.email } : {})}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@institution.edu.in"
                    className={bareInput}
                  />
                </GroupField>
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="mt-6 h-12 w-full rounded-full text-[15px]"
              >
                {busy ? <Spinner className="size-4 text-primary-foreground" /> : "Send reset link"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 h-11 w-full rounded-full"
                onClick={() => setMode("login")}
              >
                Back to sign in
              </Button>
            </form>
          </>
        )}

        {mode === "reset_sent" && (
          <div className="py-4 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-[1.15rem] bg-tint text-tint-foreground">
              <MailCheck className="size-5" />
            </span>
            <h1 className="display mt-5 text-[1.6rem] leading-tight text-foreground">
              Check your email
            </h1>
            <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
              We sent a reset link to {email}. It expires in 30 minutes.
            </p>
            <div className="mt-7 space-y-2">
              <Button
                variant="outline"
                className="h-12 w-full rounded-full text-[15px]"
                onClick={() => setMode("reset")}
              >
                Try a different email
              </Button>
              <Button
                variant="ghost"
                className="h-11 w-full rounded-full"
                onClick={() => setMode("login")}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
