import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, LogOut, Palette, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Avatar,
  Button,
  Card,
  ListRow,
  PageHeader,
  Pill,
  SectionHeader,
  SegmentedToggle,
} from "@/components/aarth/primitives";
import { useApp } from "@/lib/app-context";
import { INSTITUTION } from "@/data/mock";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Aarth Educator" },
      {
        name: "description",
        content:
          "Manage your profile, appearance, institution details, notifications and security preferences.",
      },
      { property: "og:title", content: "Settings — Aarth Educator" },
      { property: "og:description", content: "Profile, appearance and institution preferences." },
    ],
  }),
  component: Settings,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

function Toggle({ label, hint, on }: { label: string; hint: string; on?: boolean }) {
  const [value, setValue] = useState(Boolean(on));
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        aria-pressed={value}
        onClick={() => setValue((prev) => !prev)}
        className={`press mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors ${
          value ? "border-primary bg-primary" : "border-border bg-muted"
        }`}
      >
        <span
          className={`block size-4.5 rounded-full bg-card transition-transform ${
            value ? "translate-x-5.5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function Settings() {
  const { user, isAdmin, theme, setTheme } = useApp();

  return (
    <AppShell title="Settings">
      <div className="space-y-8">
        <PageHeader
          kicker="Account"
          title="Settings"
          subtitle="Your profile, how the app looks, and what you get notified about."
        />

        <section className="space-y-3">
          <SectionHeader title="Profile" hint="Visible to your institution" />
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="lg" className="size-14 text-base" />
              <div className="min-w-0">
                <p className="display text-xl text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Pill tone="outline" className="ml-auto">
                {isAdmin ? "Administrator" : "Teacher"}
              </Pill>
            </div>
            <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">
                  Display name
                </span>
                <input defaultValue={user.name} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">Phone</span>
                <input defaultValue="+91 98451 20034" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">
                  Designation
                </span>
                <input defaultValue="Senior Faculty" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">Timezone</span>
                <select className={inputClass}>
                  <option>Asia/Kolkata (IST)</option>
                </select>
              </label>
            </div>
            <div className="mt-5 flex justify-end border-t border-border pt-4">
              <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Appearance" hint="Applies on this device" />
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-tint text-tint-foreground">
                  <Palette className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">
                    Follow the system, or lock light / dark.
                  </p>
                </div>
              </div>
              <SegmentedToggle
                value={theme}
                onChange={setTheme}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                  { value: "system", label: "System" },
                ]}
              />
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Notifications" hint="Email and in-app" />
          <Card className="divide-y divide-border px-5">
            <Toggle
              label="Institution announcements"
              hint="Urgent and important notices from your admin."
              on
            />
            <Toggle label="Class activity" hint="Quiz responses, submissions and joins." on />
            <Toggle label="Planner reminders" hint="When a chapter falls behind its planned week." />
            <Toggle label="Weekly digest email" hint="A Monday summary of the week ahead." on />
          </Card>
        </section>

        {isAdmin && (
          <section className="space-y-3">
            <SectionHeader title="Institution" hint="Admin only" />
            <Card>
              <div className="divide-y divide-border">
                <ListRow
                  icon={<Building2 className="size-4" />}
                  title={INSTITUTION.name}
                  subtitle={`${INSTITUTION.city} · ${INSTITUTION.state}`}
                  onClick={() => toast.success("Institution profile")}
                />
                <ListRow
                  icon={<Shield className="size-4" />}
                  title="Roles & permissions"
                  subtitle="Who can create classes, invite people and publish content"
                  onClick={() => toast.success("Roles")}
                />
                <ListRow
                  icon={<User className="size-4" />}
                  title="Plan & billing"
                  subtitle="Institution plan · Assignments and Analytics not enabled"
                  onClick={() => toast.success("Billing")}
                />
              </div>
            </Card>
          </section>
        )}

        <section className="space-y-3">
          <SectionHeader title="Security" />
          <Card>
            <div className="divide-y divide-border">
              <ListRow
                icon={<Shield className="size-4" />}
                title="Change password"
                subtitle="Last changed 4 months ago"
                onClick={() => toast.success("Password dialog")}
              />
              <ListRow
                icon={<LogOut className="size-4" />}
                title="Sign out"
                subtitle="End this session on this device"
                onClick={() => toast.success("Signed out")}
              />
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
