import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Mail, Phone, Plus } from "lucide-react";
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
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { useApp } from "@/lib/app-context";
import { classes, className, teachers, type TeacherRecord } from "@/data/mock";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Teachers — Aarth Educator" },
      {
        name: "description",
        content:
          "Faculty directory with departments, class assignments and invite management for admins.",
      },
      { property: "og:title", content: "Teachers — Aarth Educator" },
      { property: "og:description", content: "Faculty directory and class assignments." },
    ],
  }),
  component: Teachers,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

const DEPARTMENTS = ["all", "Science", "Mathematics", "Humanities", "Languages", "Commerce"];

function TeacherDetail({ teacher }: { teacher: TeacherRecord }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <Avatar name={teacher.name} size="lg" className="size-14 text-base" />
        <div className="min-w-0">
          <h2 className="display text-xl text-foreground">{teacher.name}</h2>
          <p className="text-xs text-muted-foreground">
            {teacher.title} · {teacher.department}
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 border-t border-border pt-4 text-xs">
        <div className="flex items-center gap-2">
          <Mail className="size-3.5 text-muted-foreground" />
          <dd className="truncate text-foreground">{teacher.email}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-3.5 text-muted-foreground" />
          <dd className="text-foreground">{teacher.phone}</dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold text-foreground">Specialisations</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {teacher.specializations.map((item) => (
            <Pill key={item} tone="tint">
              {item}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold text-foreground">Assigned classes</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {teacher.classIds.map((id) => (
            <Pill key={id} tone="outline">
              {className(id)}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={() => toast.success("Assignment dialog opened")}>
          Manage classes
        </Button>
        <Button variant="ghost" onClick={() => toast.success("Message sent")}>
          Message
        </Button>
      </div>
    </Card>
  );
}

function Teachers() {
  const { isAdmin } = useApp();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [selectedId, setSelectedId] = useState(teachers[0]?.id ?? "");
  const [invite, setInvite] = useState(false);

  const list = useMemo(
    () =>
      teachers.filter(
        (teacher) =>
          (dept === "all" || teacher.department === dept) &&
          teacher.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, dept],
  );
  const selected = list.find((teacher) => teacher.id === selectedId) ?? list[0];

  return (
    <AppShell title="Teachers" wide>
      <div className="space-y-6">
        <PageHeader
          kicker="People"
          title="Teachers"
          subtitle={`${teachers.length} faculty members across ${classes.filter((c) => !c.archived).length} active classes.`}
          actions={
            isAdmin ? (
              <Button onClick={() => setInvite(true)}>
                <Plus className="size-4" /> Invite teacher
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
            placeholder="Search faculty"
            className="lg:w-80"
          />
          <FilterChips
            value={dept}
            onChange={setDept}
            className="lg:ml-auto"
            options={DEPARTMENTS.map((item) => ({
              value: item,
              label: item === "all" ? "All departments" : item,
            }))}
          />
        </div>

        {list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<GraduationCap className="size-5" />}
              title="No faculty matched"
              description="Try another name or clear the department filter."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setDept("all");
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
              <SectionHeader title="Faculty" hint={`${list.length} members`} />
              <Card className="mt-3">
                <div className="divide-y divide-border">
                  {list.map((teacher) => (
                    <PersonRow
                      key={teacher.id}
                      name={teacher.name}
                      meta={`${teacher.title} · ${teacher.classIds.length} classes`}
                      active={selected?.id === teacher.id}
                      onClick={() => setSelectedId(teacher.id)}
                      trailing={<Pill tone="outline">{teacher.department}</Pill>}
                    />
                  ))}
                </div>
              </Card>
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeader title="Teacher" hint="Details" />
              <div className="mt-3">{selected && <TeacherDetail teacher={selected} />}</div>
            </div>
          </div>
        )}
      </div>

      <ResponsiveDialog
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite teacher"
        description="They receive an email invite to join your institution on Aarth Educator."
        footer={
          <>
            <Button variant="ghost" onClick={() => setInvite(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setInvite(false);
                toast.success("Invite sent");
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Full name</span>
            <input placeholder="Shreya Kulkarni" className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Email</span>
            <input placeholder="shreya.kulkarni@sringeri.edu.in" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Department</span>
            <select className={inputClass}>
              {DEPARTMENTS.filter((item) => item !== "all").map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Role</span>
            <select className={inputClass}>
              <option>Teacher</option>
              <option>Admin</option>
            </select>
          </label>
        </div>
      </ResponsiveDialog>
    </AppShell>
  );
}
