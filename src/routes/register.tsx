import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Crop, Eye, EyeOff, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/aarth/app-shell";
import { Button, Card, Pill, Spinner } from "@/components/aarth/primitives";
import { inputClass } from "@/components/aarth/login-screen";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register your institution — Aarth Educator" },
      {
        name: "description",
        content:
          "Create an Aarth Educator workspace for your school or college and add your first admin account.",
      },
      { property: "og:title", content: "Register your institution — Aarth Educator" },
      {
        property: "og:description",
        content: "Set up your institution's AI teaching workspace in a few minutes.",
      },
    ],
  }),
  component: Register,
});

const STATES = ["Karnataka", "Maharashtra", "Tamil Nadu", "Telangana", "Kerala", "Delhi"];

function LogoCropDialog({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl border border-border bg-card p-5 sm:rounded-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-center gap-2">
          <Crop className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Crop logo — 4:1</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Institution logos render in a wide 4:1 frame across the portal.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted">
          <div className="flex aspect-[4/1] items-center justify-center">
            <span
              className="text-sm font-semibold text-muted-foreground"
              style={{ transform: `scale(${zoom})` }}
            >
              Your logo preview
            </span>
          </div>
        </div>
        <label className="mt-4 block text-xs font-semibold text-foreground">
          Zoom
          <input
            type="range"
            min={1}
            max={2}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-primary)]"
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDone();
              onClose();
            }}
          >
            Use this crop
          </Button>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [cropOpen, setCropOpen] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [verified, setVerified] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 12) return setError("Admin passwords must be at least 12 characters");
    if (password !== confirm) return setError("Passwords do not match");
    if (!verified) return setError("Please complete the human check");
    setError(null);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success("Institution created");
      navigate({ to: "/onboarding" });
    }, 1100);
  }

  return (
    <AuthLayout>
      <Card className="p-7">
        <p className="eyebrow text-muted-foreground">
          Institution setup
        </p>
        <h1 className="display mt-2 text-[2rem] text-foreground">
          Bring your <em className="text-primary">campus</em> onboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your institution workspace and its first admin account.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <div className="rounded-xl border border-dashed border-border p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-tint text-tint-foreground">
                <Building2 className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">Institution logo</p>
                <p className="text-[11px] text-muted-foreground">PNG or SVG, cropped to 4:1</p>
              </div>
              {logoReady ? (
                <Pill tone="tint">Ready</Pill>
              ) : (
                <Button size="sm" variant="outline" type="button" onClick={() => setCropOpen(true)}>
                  <Upload className="size-3.5" /> Upload
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Institution name
              </span>
              <input className={inputClass} placeholder="Sringeri Vidya Mandir" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Area / campus
              </span>
              <input className={inputClass} placeholder="Jayanagar Campus" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">City</span>
              <input className={inputClass} placeholder="Bengaluru" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">State</span>
              <select className={inputClass} defaultValue="Karnataka">
                {STATES.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="h-px bg-border" />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Admin full name
              </span>
              <input className={inputClass} placeholder="Rajesh Iyer" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Admin email
              </span>
              <input type="email" className={inputClass} placeholder="admin@institution.edu.in" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">Password</span>
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
              <span className="mt-1.5 block text-[11px] text-muted-foreground">
                Minimum 12 characters for admin accounts
              </span>
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
          </div>

          <button
            type="button"
            onClick={() => setVerified((v) => !v)}
            className={cn(
              "press flex w-full items-center gap-3 rounded-xl border p-3 text-left",
              verified ? "border-primary/40 bg-tint" : "border-border bg-card",
            )}
          >
            <ShieldCheck
              className={cn("size-5", verified ? "text-primary" : "text-muted-foreground")}
            />
            <span className="flex-1 text-xs font-semibold text-foreground">
              {verified ? "Human check complete" : "Verify you're human"}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Turnstile
            </span>
          </button>

          {error && <p className="text-[11px] text-destructive">{error}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? (
              <>
                <Spinner className="size-4 text-primary-foreground" /> Creating institution…
              </>
            ) : (
              "Create institution"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already registered?{" "}
          <Link to="/auth" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </Card>

      <LogoCropDialog
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        onDone={() => setLogoReady(true)}
      />
    </AuthLayout>
  );
}
