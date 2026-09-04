import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Link2, Mail, Phone, Plus, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  FilterChips,
  PageHeader,
  PersonRow,
  Pill,
  SearchField,
  SectionHeader,
  SegmentedToggle,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
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
    ],
  }),
  component: Students,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

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

function StudentDetail({ student }: { student: StudentRecord }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <Avatar name={student.name} size="lg" className="size-14 text-base" />
        <div className="min-w-0">
          <h2 className="display text-xl text-foreground">{student.name}</h2>
          <p className="text-xs text-muted-foreground">
            Roll {student.rollNumber} · {className(student.classId)}
          </p>
        </div>
      </div>

      {student.invited && (
        <div className="mt-4 rounded-xl border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
          Invite sent — waiting for the student to accept.
        </div>
      )}

      <dl className="mt-5 space-y-3 border-t border-border pt-4 text-xs">
        <div className="flex items-center gap-2">
          <Mail className="size-3.5 text-muted-foreground" />
          <dd className="truncate text-foreground">{student.email}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-3.5 text-muted-foreground" />
          <dd className="text-foreground">{student.phone}</dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold text-foreground">Subjects</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {student.subjects.map((subject) => (
            <Pill key={subject} tone="tint">
              {subject}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={() => toast.success("Message sent")}>
          Message
        </Button>
        <Button variant="ghost" onClick={() => toast.success("Invite resent")}>
          Resend invite
        </Button>
      </div>
    </Card>
  );
}

function Students() {
  const { isAdmin } = useApp();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [selectedId, setSelectedId] = useState(students[0]?.id ?? "");
  const [invite, setInvite] = useState(false);

  const list = useMemo(
    () =>
      students.filter(
        (student) =>
          (scope === "all" || student.classId === scope) &&
          `${student.name} ${student.rollNumber}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, scope],
  );

  const selected = list.find((student) => student.id === selectedId) ?? list[0];

  return (
    <AppShell title="Students" wide>
      <div className="space-y-6">
        <PageHeader
          kicker="People"
          title="Students"
          subtitle={`${students.length} students shown across ${classes.filter((c) => !c.archived).length} active classes.`}
          actions={
            isAdmin ? (
              <Button onClick={() => setInvite(true)}>
                <Plus className="size-4" /> Invite students
              </Button>
            ) : (
              <Pill tone="outline">Faculty view</Pill>
            )
          }
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search by name or roll number"
            className="lg:w-80"
          />
          <FilterChips
            value={scope}
            onChange={setScope}
            className="lg:ml-auto"
            options={[
              { value: "all", label: "All classes" },
              ...classes
                .filter((klass) => !klass.archived)
                .map((klass) => ({
                  value: klass.id,
                  label: klass.name.replace("Class ", "Cl. "),
                })),
            ]}
          />
        </div>

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
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHeader title="Directory" hint={`${list.length} students`} />
              <Card className="mt-3">
                <div className="divide-y divide-border">
                  {list.map((student) => (
                    <PersonRow
                      key={student.id}
                      name={student.name}
                      meta={`Roll ${student.rollNumber} · ${className(student.classId)}`}
                      active={selected?.id === student.id}
                      onClick={() => setSelectedId(student.id)}
                      trailing={student.invited ? <Pill tone="outline">Invited</Pill> : undefined}
                    />
                  ))}
                </div>
              </Card>
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeader title="Student" hint="Details" />
              <div className="mt-3">{selected && <StudentDetail student={selected} />}</div>
            </div>
          </div>
        )}
      </div>

      <InviteDialog open={invite} onClose={() => setInvite(false)} />
    </AppShell>
  );
}
