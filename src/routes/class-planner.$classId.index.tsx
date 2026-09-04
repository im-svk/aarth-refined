import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookMarked, CalendarRange } from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Card,
  EmptyState,
  ListRow,
  PageHeader,
  Pill,
  PlanGate,
  SectionHeader,
  StatTile,
} from "@/components/aarth/primitives";
import { useApp } from "@/lib/app-context";
import { chapters, classById, formatDate, plans, subjectsForClass } from "@/data/mock";

export const Route = createFileRoute("/class-planner/$classId/")({
  loader: ({ params }) => {
    const klass = classById(params.classId);
    if (!klass) throw notFound();
    return { klass };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Plan unavailable — Aarth Educator" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.klass.name} plan — Aarth Educator`;
    const description = `Term pacing plan for ${loaderData.klass.name}: subject progress and chapter distribution.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PlannerDetail,
});

function PlannerDetail() {
  const { klass } = Route.useLoaderData();
  const { planEnabled } = useApp();
  const plan = plans.find((item) => item.classId === klass.id);
  const subjects = subjectsForClass(klass.id);

  return (
    <AppShell title="Plan" back>
      <div className="space-y-6">
        <PageHeader
          kicker={
            <Link to="/class-planner" className="hover:text-foreground">
              Class planner
            </Link>
          }
          title={`${klass.name} plan`}
          subtitle={
            plan
              ? `${formatDate(plan.termStart)} – ${formatDate(plan.termEnd)} · ${plan.daysLeft} days left in term.`
              : "No plan has been created for this class yet."
          }
          actions={<Pill tone="outline">{klass.board}</Pill>}
        />

        {!planEnabled ? (
          <PlanGate
            feature="Class Planner"
            description="Term pacing plans are part of a higher institution plan. Your admin can enable it for all faculty."
          />
        ) : !plan ? (
          <Card>
            <EmptyState
              icon={<CalendarRange className="size-5" />}
              title="No plan for this class"
              description="Create a plan from the planner home to distribute chapters across the term."
            />
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile
                label="Subjects planned"
                value={`${plan.plannedSubjects}/${plan.totalSubjects}`}
              />
              <StatTile
                label="Chapters done"
                value={`${plan.doneChapters}/${plan.totalChapters}`}
              />
              <StatTile label="Days left" value={plan.daysLeft} hint="Until term end" />
            </div>

            <section className="space-y-3">
              <SectionHeader title="Subject plans" hint="Open one to adjust chapter weeks" />
              <Card>
                <div className="divide-y divide-border">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.id}
                      to="/class-planner/$classId/plan/$subjectId"
                      params={{ classId: klass.id, subjectId: subject.id }}
                    >
                      <ListRow
                        interactive
                        icon={<BookMarked className="size-4" />}
                        title={subject.name}
                        subtitle={`${subject.moduleCount} modules mapped`}
                      />
                    </Link>
                  ))}
                </div>
              </Card>
            </section>

            <section className="space-y-3">
              <SectionHeader title="Term timeline" hint="Chapter placement" />
              <Card className="divide-y divide-border px-5">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center gap-3 py-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
                      {chapter.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {chapter.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Starts {formatDate(chapter.plannedStart)} · {chapter.weeks} weeks
                      </p>
                    </div>
                    <Pill tone={chapter.status === "in_progress" ? "tint" : "outline"}>
                      {chapter.status === "done"
                        ? "Done"
                        : chapter.status === "in_progress"
                          ? "Teaching now"
                          : "Planned"}
                    </Pill>
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
