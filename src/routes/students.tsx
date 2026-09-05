import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  Copy,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  FilterChips,
  Pill,
  SearchField,
  SegmentedToggle,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { SideSheet } from "@/components/aarth/side-sheet";
import { useApp } from "@/lib/app-context";
import { classes, className, students, type StudentRecord } from "@/data/mock";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — Aarth Educator" },
      {
        name: "description",
        content:
          "Student directory with class filters, invite links and bulk invites for your institution.",
      },
      { property: "og:title", content: "Students — Aarth Educator" },
      { property: "og:description", content: "Directory, invites and enrolment per class." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Students,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

const TONES = ["ev-1", "ev-2", "ev-3", "ev-4", "ev-5"] as const;

function toneFor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) % 9973;
  return TONES[hash % TONES.length] as string;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ToneAvatar({
  name,
  seed,
  className: cls,
}: {
  name: string;
  seed: string;
  className?: string;
}) {
  const tone = toneFor(seed);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${cls ?? "size-10"}`}
      style={{
        backgroundColor: `color-mix(in oklab, var(--${tone}-bg) 85%, var(--card))`,
        color: `var(--${tone})`,
      }}
    >
      {initials(name)}
    </span>
  );
}

/* ---------------- Invite ---------------- */

function InviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"email" | "link" | "bulk">("email");
  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Invite students"
      description="Send individual invites, share a join link, or paste a list."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              toast.success("Invites sent");
            }}
          >
            Send invites
          </Button>
        </>
      }
    >
      <SegmentedToggle
        value={mode}
        onChange={setMode}
        options={[
          { value: "email", label: "By email" },
          { value: "link", label: "Join link" },
          { value: "bulk", label: "Bulk paste" },
        ]}
      />

      <div className="mt-4 space-y-4">
        {mode === "email" && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">Class</span>
              <select className={inputClass}>
                {classes
                  .filter((klass) => !klass.archived)
                  .map((klass) => (
                    <option key={klass.id}>{klass.name}</option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Student email
              </span>
              <input placeholder="aditi.rao@student.sringeri.edu.in" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Roll number
              </span>
              <input placeholder="11S-04" className={inputClass} />
            </label>
          </>
        )}

        {mode === "link" && (
          <div className="space-y-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Anyone with this link can request to join Class 11 — Science. The link expires in 7
              days.
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-3">
              <Link2 className="size-4 shrink-0 text-muted-foreground" />
              <code className="min-w-0 flex-1 truncate text-[11px] text-foreground">
                aartheducator.in/join/11S-KX92QF
              </code>
              <Button variant="ghost" onClick={() => toast.success("Link copied")}>
                <Copy className="size-4" /> Copy
              </Button>
            </div>
          </div>
        )}

        {mode === "bulk" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              One student per line — name, email, roll number
            </span>
            <textarea
              rows={6}
              placeholder={"Aditi Rao, aditi.rao@student.sringeri.edu.in, 11S-04"}
              className="w-full rounded-xl border border-border bg-card p-3 font-mono text-xs outline-none focus:border-primary/50"
            />
            <span className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Upload className="size-3.5" /> Or upload a CSV export from your ERP
            </span>
          </label>
        )}
      </div>
    </ResponsiveDialog>
  );
}

/* ---------------- Detail sheet ---------------- */

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-[11px] font-semibold text-foreground shadow-[var(--shadow-card)]"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-tint text-tint-foreground">
        {icon}
      </span>
      {label}
    </button>
  );
}

function StudentSheet({
  student,
  onClose,
}: {
  student: StudentRecord | null;
  onClose: () => void;
}) {
  return (
    <SideSheet
      open={Boolean(student)}
      onClose={onClose}
      label={student ? `${student.name} details` : "Student details"}
      footer={
        student ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => toast.success("Invite resent")}>
              Resend invite
            </Button>
            <Button onClick={() => toast.success("Message sent")}>Message</Button>
          </div>
        ) : undefined
      }
    >
      {student && (
        <div className="px-5 pb-6 pt-2">
          <div className="flex flex-col items-center text-center">
            <ToneAvatar
              name={student.name}
              seed={student.id}
              className="size-20 !text-xl shadow-[var(--shadow-card)]"
            />
            <h2 className="display mt-3 text-xl text-foreground">{student.name}</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Roll {student.rollNumber} · {className(student.classId)}
            </p>
            <div className="mt-2.5">
              {student.invited ? (
                <Pill tone="outline">Invite pending</Pill>
              ) : (
                <Pill tone="tint">Active student</Pill>
              )}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <QuickAction
              icon={<MessageSquare className="size-4" />}
              label="Message"
              onClick={() => toast.success("Message sent")}
            />
            <QuickAction
              icon={<Phone className="size-4" />}
              label="Call"
              onClick={() => toast.success(`Calling ${student.phone}`)}
            />
            <QuickAction
              icon={<Mail className="size-4" />}
              label="Email"
              onClick={() => toast.success("Email drafted")}
            />
          </div>

          {student.invited && (
            <div className="mt-5 rounded-2xl border border-border bg-muted/50 p-3.5 text-[12px] leading-relaxed text-muted-foreground">
              Invite sent — waiting for the student to accept.
            </div>
          )}

          <div className="mt-5">
            <p className="eyebrow text-[11px] text-muted-foreground">Contact</p>
            <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
                  {student.email}
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-[13px] text-foreground">{student.phone}</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="eyebrow text-[11px] text-muted-foreground">
              Subjects · {student.subjects.length}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {student.subjects.map((subject) => {
                const tone = toneFor(subject);
                return (
                  <span
                    key={subject}
                    className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                    style={{
                      backgroundColor: `color-mix(in oklab, var(--${tone}-bg) 80%, var(--card))`,
                      color: `var(--${tone})`,
                    }}
                  >
                    {subject}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </SideSheet>
  );
}

/* ---------------- Page ---------------- */

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 px-2 text-center">
      <p className="display text-lg leading-none text-foreground">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function Students() {
  const { isAdmin } = useApp();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [invite, setInvite] = useState(false);

  const activeClasses = classes.filter((klass) => !klass.archived);
  const pending = students.filter((student) => student.invited).length;

  const list = useMemo(
    () =>
      students.filter(
        (student) =>
          (scope === "all" || student.classId === scope) &&
          `${student.name} ${student.rollNumber}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, scope],
  );




  const selected = students.find((student) => student.id === selectedId) ?? null;

  return (
    <AppShell title="Students" wide>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex min-h-11 items-center gap-3">
          {!searchOpen ? (
            <>
              <div className="min-w-0 flex-1">
                <h1 className="display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
                  Students
                </h1>
                <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">
                  {students.length} students · {activeClasses.length} active classes
                </p>
              </div>
              <button
                type="button"
                aria-label="Search students"
                onClick={() => setSearchOpen(true)}
                className="press inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-card)] md:hidden"
              >
                <Search className="size-[18px]" />
              </button>
              {isAdmin && (
                <div className="hidden md:block">
                  <Button onClick={() => setInvite(true)}>
                    <Plus className="size-4" /> Invite students
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex w-full items-center gap-2">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or roll number"
                className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="press inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-3 text-[13px] font-semibold text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center rounded-2xl border border-border bg-card py-3.5 shadow-[var(--shadow-card)]">
          <Stat value={students.length} label="Students" />
          <span className="h-8 w-px bg-border" />
          <Stat value={activeClasses.length} label="Classes" />
          <span className="h-8 w-px bg-border" />
          <Stat value={pending} label="Pending" />
        </div>

        {/* Desktop search */}
        <div className="hidden gap-3 md:flex md:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search by name or roll number"
            className="lg:w-80"
          />
        </div>

        <FilterChips
          value={scope}
          onChange={setScope}
          options={[
            { value: "all", label: "All classes" },
            ...activeClasses.map((klass) => ({
              value: klass.id,
              label: klass.name.replace("Class ", "Cl. "),
            })),
          ]}
        />

        {list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Users className="size-5" />}
              title="No students matched"
              description="Try another name or roll number, or clear the class filter."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setScope("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </Card>
        ) : (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="eyebrow text-[11px] text-muted-foreground">Directory</p>
              <span className="rounded-full bg-tint px-2 py-0.5 text-[10px] font-semibold text-tint-foreground">
                {list.length}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] md:grid md:grid-cols-2 md:gap-3 md:border-0 md:bg-transparent md:shadow-none">
              {list.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => setSelectedId(student.id)}
                  className="press flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-muted/50 md:rounded-2xl md:border md:bg-card md:shadow-[var(--shadow-card)]"
                >
                  <ToneAvatar name={student.name} seed={student.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-foreground">
                      {student.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">
                      Roll {student.rollNumber} · {className(student.classId)}
                    </span>
                  </span>
                  {student.invited && (
                    <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Invited
                    </span>
                  )}
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}


        {isAdmin && (
          <div className="md:hidden">
            <Button className="w-full" onClick={() => setInvite(true)}>
              <Plus className="size-4" /> Invite students
            </Button>
          </div>
        )}
      </div>

      <StudentSheet student={selected} onClose={() => setSelectedId(null)} />
      <InviteDialog open={invite} onClose={() => setInvite(false)} />
    </AppShell>
  );
}
