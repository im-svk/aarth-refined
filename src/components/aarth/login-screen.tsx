import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "./app-shell";
import { Button, Card, Spinner } from "./primitives";
import { cn } from "@/lib/utils";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50";

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
      <Card className="p-7">
        {mode === "login" && (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Educator sign in
            </p>
            <h1 className="display mt-2 text-[2.1rem] text-foreground">
              Teach with <em className="text-primary">clarity</em>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your classes, study material and assessments in one calm workspace.
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <Field label="Email" {...(errors.email ? { error: errors.email } : {})}>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@institution.edu.in"
                  className={inputClass}
                />
              </Field>
              <Field label="Password" {...(errors.password ? { error: errors.password } : {})}>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(inputClass, "pr-11")}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-1 top-0 flex h-11 w-10 items-center justify-center text-muted-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setMode("reset");
                  }}
                  className="text-xs font-semibold text-primary"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <Spinner className="size-4 text-primary-foreground" /> : "Sign in"}
                {!busy && <ArrowRight className="size-4" />}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              New institution?{" "}
              <Link to="/register" className="font-semibold text-primary">
                Create an account
              </Link>
            </p>
          </>
        )}

        {mode === "reset" && (
          <>
            <span className="flex size-11 items-center justify-center rounded-xl bg-tint text-tint-foreground">
              <Mail className="size-5" />
            </span>
            <h1 className="display mt-4 text-3xl text-foreground">Reset your password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll email a secure link to set a new password.
            </p>
            <form onSubmit={sendReset} className="mt-6 space-y-4">
              <Field label="Email" {...(errors.email ? { error: errors.email } : {})}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@institution.edu.in"
                  className={inputClass}
                />
              </Field>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <Spinner className="size-4 text-primary-foreground" /> : "Send reset link"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setMode("login")}
              >
                Back to sign in
              </Button>
            </form>
          </>
        )}

        {mode === "reset_sent" && (
          <div className="py-4 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
              <MailCheck className="size-5" />
            </span>
            <h1 className="display mt-4 text-2xl text-foreground">Check your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a reset link to {email}. It expires in 30 minutes.
            </p>
            <div className="mt-6 space-y-2">
              <Button variant="outline" className="w-full" onClick={() => setMode("reset")}>
                Try a different email
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setMode("login")}>
                Back to sign in
              </Button>
            </div>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
}
