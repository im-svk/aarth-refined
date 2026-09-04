import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Card,
  ListRow,
  PageHeader,
  PlanGate,
  Pill,
  SectionHeader,
} from "@/components/aarth/primitives";
import { useApp } from "@/lib/app-context";
import { calendarEvents, className } from "@/data/mock";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — Aarth Educator" },
      {
        name: "description",
        content: "Set assignments with due dates and track submissions class by class.",
      },
      { property: "og:title", content: "Assignments — Aarth Educator" },
      { property: "og:description", content: "Set assignments and track submissions." },
    ],
  }),
  component: Assignments,
});

function Assignments() {
  const { planEnabled } = useApp();
  const due = calendarEvents.filter((event) => event.kind === "assignment");

  return (
    <AppShell title="Assignments">
      <div className="space-y-6">
        <PageHeader
          kicker="Teach"
          title="Assignments"
          subtitle="Set work with due dates, collect submissions and mark them in one place."
        />

        {!planEnabled ? (
          <PlanGate
            feature="Assignments"
            description="Setting assignments and collecting submissions is part of a higher institution plan. Your admin can enable it for all faculty."
          />
        ) : (
          <section className="space-y-3">
            <SectionHeader title="Upcoming due dates" hint={`${due.length} assignments`} />
            <Card>
              <div className="divide-y divide-border">
                {due.map((event) => (
                  <ListRow
                    key={event.id}
                    icon={<ClipboardList className="size-4" />}
                    title={event.title}
                    subtitle={className(event.classId)}
                    trailing={<Pill tone="outline">{event.day} Sep</Pill>}
                  />
                ))}
              </div>
            </Card>
          </section>
        )}
      </div>
    </AppShell>
  );
}
