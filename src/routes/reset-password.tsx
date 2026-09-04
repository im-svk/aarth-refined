import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, EyeOff, KeyRound, TriangleAlert } from "lucide-react";
import { AuthLayout } from "@/components/aarth/app-shell";
import { Button, Card, Spinner } from "@/components/aarth/primitives";
import { inputClass } from "@/components/aarth/login-screen";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Aarth Educator" },
      {
        name: "description",
        content: "Set a new password for your Aarth Educator educator account.",
      },
      { property: "og:title", content: "Set a new password — Aarth Educator" },
      { property: "og:description", content: "Create a new password from your recovery link." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [phase, setPhase] = useState<"verifying" | "form" | "invalid" | "done">("verifying");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("form"), 900);
    return () => clearTimeout(timer);
  }, []);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setError(null);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setPhase("done");
    }, 900);
  }

  return (
    <AuthLayout>
      <Card className="p-7">
        {phase === "verifying" && (
          <div className="flex flex-col items-center gap-3 py-12">
            <Spinner />
            <p className="text-xs text-muted-foreground">Verifying reset link…</p>
          </div>
        )}

        {phase === "invalid" && (
          <div className="py-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" />
            </span>
            <h1 className="display mt-4 text-2xl text-foreground">This link has expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Reset links are valid for 30 minutes. Request a fresh one from the sign-in screen.
            </p>
            <Link to="/auth" className="mt-6 inline-block">
              <Button>Back to sign in</Button>
            </Link>
          </div>
        )}

        {phase === "form" && (
          <>
            <span className="flex size-11 items-center justify-center rounded-xl bg-tint text-tint-foreground">
              <KeyRound className="size-5" />
            </span>
            <h1 className="display mt-4 text-3xl text-foreground">Set a new password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a password you haven't used before. Minimum 6 characters.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">
                  New password
                </span>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">
                  Confirm password
                </span>
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                />
              </label>
              {error && <p className="text-[11px] text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <Spinner className="size-4 text-primary-foreground" /> : "Update password"}
              </Button>
              <button
                type="button"
                onClick={() => setPhase("invalid")}
                className="w-full text-center text-[11px] text-muted-foreground underline-offset-2 hover:underline"
              >
                Preview the expired-link state
              </button>
            </form>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/auth" className="font-semibold text-primary">
                Back to sign in
              </Link>
            </p>
          </>
        )}

        {phase === "done" && (
          <div className="py-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
              <CheckCircle2 className="size-5" />
            </span>
            <h1 className="display mt-4 text-2xl text-foreground">Password updated</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You've been signed out of other sessions. Redirecting you to sign in…
            </p>
            <Link to="/auth" className="mt-6 inline-block">
              <Button>Sign in now</Button>
            </Link>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
}
