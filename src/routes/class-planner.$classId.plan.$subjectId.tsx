import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  PageHeader,
  Pill,
  PlanGate,
  SectionHeader,
  StatTile,
} from "@/components/aarth/primitives";
import { useApp } from "@/lib/app-context";
import { chapters, classById, formatDate, subjects as allSubjects } from "@/data/mock";

export const Route = createFileRoute("/class-planner/$classId/plan/$subjectId")({
  loader: ({ params }) => {
    const klass = classById(params.classId);
    const subject = allSubjects.find((item) => item.id === params.subjectId);
    if (!klass || !subject) throw notFound();
    return { klass, subject };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Subject plan unavailable — Aarth Educator" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.subject.name} plan — Aarth Educator`;
    const description = `Chapter-by-chapter pacing for ${loaderData.subject.name} in ${loaderData.klass.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SubjectPlanner,
});

function SubjectPlanner() {
  const { klass, subject } = Route.useLoaderData();
  const { planEnabled } = useApp();
  const [weeks, setWeeks] = useState<Record<string, number>>(
    Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter.weeks])),
  );

  const totalWeeks = Object.values(weeks).reduce((sum, value) => sum + value, 0);

  return (
    <AppShell title={subject.name} back>
      <div className="space-y-6">
        <PageHeader
          kicker={
            <Link
              to="/class-planner/$classId"
              params={{ classId: klass.id }}
              className="hover:text-foreground"
            >
              {klass.name} plan
            </Link>
          }
          title={subject.name}
          subtitle="Adjust how many weeks each chapter gets. Totals update against the term length."
          actions={
            planEnabled ? (
              <Button onClick={() => toast.success("Plan saved")}>
                <Save className="size-4" /> Save plan
              </Button>
            ) : undefined
          }
        />

        {!planEnabled ? (
          <PlanGate
            feature="Class Planner"
            description="Subject pacing is part of a higher institution plan. Your admin can enable it for all faculty."
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile label="Chapters" value={chapters.length} />
              <StatTile label="Weeks allocated" value={totalWeeks} hint="Term has 20 weeks" />
              <StatTile
                label="Buffer"
                value={20 - totalWeeks}
                hint={totalWeeks > 20 ? "Over term length" : "Weeks spare"}
              />
            </div>

            <section className="space-y-3">
              <SectionHeader title="Chapter pacing" hint="Weeks per chapter" />
              <Card className="divide-y divide-border px-5">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex flex-wrap items-center gap-3 py-4 sm:flex-nowrap"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
                      {chapter.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {chapter.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Starts {formatDate(chapter.plannedStart)}
                      </p>
                    </div>
                    <Pill tone={chapter.status === "in_progress" ? "tint" : "outline"}>
                      {chapter.status === "done"
                        ? "Done"
                        : chapter.status === "in_progress"
                          ? "Teaching now"
                          : "Planned"}
                    </Pill>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={weeks[chapter.id]}
                        onChange={(event) =>
                          setWeeks((prev) => ({
                            ...prev,
                            [chapter.id]: Number(event.target.value),
                          }))
                        }
                        className="h-9 w-16 rounded-xl border border-border bg-card px-2 text-center text-sm text-foreground outline-none focus:border-primary/50"
                      />
                      <span className="text-[11px] text-muted-foreground">weeks</span>
                    </div>
                  </div>
                ))}
              </Card>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
