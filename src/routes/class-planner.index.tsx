import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarRange, Plus, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  Pill,
  PlanGate,
  SectionHeader,
  SegmentedToggle,
  Spinner,
  StatTile,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { useApp } from "@/lib/app-context";
import { classes, formatDate, plans, subjectsForClass } from "@/data/mock";

export const Route = createFileRoute("/class-planner/")({
  head: () => ({
    meta: [
      { title: "Class Planner — Aarth Educator" },
      {
        name: "description",
        content:
          "Plan a term subject by subject: chapter pacing, weekly load and progress against the syllabus.",
      },
      { property: "og:title", content: "Class Planner — Aarth Educator" },
      { property: "og:description", content: "Term pacing plans per class and subject." },
    ],
  }),
  component: ClassPlanner,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

function CreatePlanWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [classId, setClassId] = useState(classes[3]!.id);
  const [busy, setBusy] = useState(false);

  const close = () => {
    onClose();
    setStep(1);
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={close}
      title={step === 1 ? "New plan · Scope" : "New plan · Pacing"}
      description={
        step === 1
          ? "Choose the class and term window."
          : "Set the weekly teaching load and let Aarth distribute chapters."
      }
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={step === 1 ? close : () => setStep(1)}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          {step === 1 ? (
            <Button onClick={() => setStep(2)}>Continue</Button>
          ) : (
            <Button
              disabled={busy}
              onClick={() => {
                setBusy(true);
                setTimeout(() => {
                  setBusy(false);
                  close();
                  toast.success("Plan created");
                }, 1200);
              }}
            >
              {busy ? (
                <>
                  <Spinner /> Building plan…
                </>
              ) : (
                <>
                  <Wand2 className="size-4" /> Create plan
                </>
              )}
            </Button>
          )}
        </>
      }
    >
      <div className="mb-5 flex items-center gap-2">
        {[1, 2].map((value) => (
          <span
            key={value}
            className={`h-1 flex-1 rounded-full ${step >= value ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Class</span>
            <select
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              className={inputClass}
            >
              {classes
                .filter((klass) => !klass.archived)
                .map((klass) => (
                  <option key={klass.id} value={klass.id}>
                    {klass.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Term start</span>
            <input type="date" defaultValue="2026-06-10" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Term end</span>
            <input type="date" defaultValue="2026-10-30" className={inputClass} />
          </label>
          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-semibold text-foreground">Subjects to plan</p>
            <div className="space-y-2 rounded-xl border border-border p-3">
              {subjectsForClass(classId).map((subject) => (
                <label key={subject.id} className="flex items-center gap-2 text-xs text-foreground">
                  <input type="checkbox" defaultChecked className="size-4 accent-primary" />
                  {subject.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              Periods per week
            </span>
            <input type="number" defaultValue={6} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              Revision weeks reserved
            </span>
            <input type="number" defaultValue={2} className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">
              Distribution style
            </span>
            <select className={inputClass}>
              <option>Even across chapters</option>
              <option>Weighted by board marks</option>
              <option>Front-load difficult chapters</option>
            </select>
          </label>
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
            Aarth will place each chapter in a week, keep holidays clear, and flag any subject that
            can't finish inside the term.
          </div>
        </div>
      )}
    </ResponsiveDialog>
  );
}

function ClassPlanner() {
  const { planEnabled } = useApp();
  const [tab, setTab] = useState<"active" | "all">("active");
  const [wizard, setWizard] = useState(false);

  return (
    <AppShell title="Class Planner">
      <div className="space-y-6">
        <PageHeader
          kicker="Teach"
          title="Class planner"
          subtitle="Pace the term chapter by chapter, and see what's slipping before it hurts."
          actions={
            planEnabled ? (
              <Button onClick={() => setWizard(true)}>
                <Plus className="size-4" /> New plan
              </Button>
            ) : undefined
          }
        />

        {!planEnabled ? (
          <PlanGate
            feature="Class Planner"
            description="Term pacing plans and chapter distribution are part of a higher institution plan. Your admin can enable it for all faculty."
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile label="Plans" value={plans.length} hint="Active terms" />
              <StatTile
                label="Chapters done"
                value={plans.reduce((sum, plan) => sum + plan.doneChapters, 0)}
                hint={`of ${plans.reduce((sum, plan) => sum + plan.totalChapters, 0)}`}
              />
              <StatTile label="Days left in term" value={plans[0]!.daysLeft} hint="Class 11 — Science" />
            </div>

            <SegmentedToggle
              value={tab}
              onChange={setTab}
              options={[
                { value: "active", label: "Active" },
                { value: "all", label: "All terms" },
              ]}
            />

            <section className="space-y-3">
              <SectionHeader title="Plans" hint="Open a plan to adjust pacing" />
              {plans.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={<CalendarRange className="size-5" />}
                    title="No plans yet"
                    description="Create a plan for a class and Aarth will distribute chapters across the term."
                    action={<Button onClick={() => setWizard(true)}>New plan</Button>}
                  />
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {plans.map((plan) => {
                    const pct = Math.round((plan.doneChapters / plan.totalChapters) * 100);
                    return (
                      <Link
                        key={plan.classId}
                        to="/class-planner/$classId"
                        params={{ classId: plan.classId }}
                      >
                        <Card accent interactive className="h-full p-5 pl-6">
                          <div className="flex items-center gap-2">
                            <Pill tone="tint">{plan.daysLeft} days left</Pill>
                            <Pill tone="outline">
                              {plan.plannedSubjects}/{plan.totalSubjects} subjects
                            </Pill>
                          </div>
                          <h3 className="display mt-3 text-xl text-foreground">{plan.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(plan.termStart)} – {formatDate(plan.termEnd)}
                          </p>
                          <div className="mt-4 border-t border-border pt-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Chapters completed</span>
                              <span className="font-semibold text-foreground">
                                {plan.doneChapters}/{plan.totalChapters}
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <CreatePlanWizard open={wizard} onClose={() => setWizard(false)} />
    </AppShell>
  );
}
