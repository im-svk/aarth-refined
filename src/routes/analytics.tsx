import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Card,
  PageHeader,
  PlanGate,
  SectionHeader,
  StatTile,
} from "@/components/aarth/primitives";
import { useApp } from "@/lib/app-context";
import { classes, className, quizzes } from "@/data/mock";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Aarth Educator" },
      {
        name: "description",
        content:
          "Class-level performance, quiz participation and syllabus pacing insights for your institution.",
      },
      { property: "og:title", content: "Analytics — Aarth Educator" },
      { property: "og:description", content: "Performance, participation and pacing insights." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const { planEnabled } = useApp();
  const published = quizzes.filter((quiz) => quiz.status === "published");

  return (
    <AppShell title="Analytics">
      <div className="space-y-6">
        <PageHeader
          kicker="Workspace"
          title="Analytics"
          subtitle="How your classes are performing, and where the syllabus is slipping."
        />

        {!planEnabled ? (
          <PlanGate
            feature="Analytics"
            description="Class performance, quiz participation and syllabus pacing insights are part of a higher institution plan. Your admin can enable it for all faculty."
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile label="Average score" value="68%" hint="Across published quizzes" />
              <StatTile label="Participation" value="87%" hint="Students who attempted" />
              <StatTile label="Syllabus pace" value="On track" hint="2 of 5 subjects behind" />
              <StatTile label="Quizzes published" value={published.length} hint="This term" />
            </div>

            <section className="space-y-3">
              <SectionHeader title="By class" hint="Average of published quizzes" />
              <Card className="divide-y divide-border px-5">
                {classes
                  .filter((klass) => !klass.archived)
                  .map((klass, index) => {
                    const score = [72, 64, 81, 58][index % 4]!;
                    return (
                      <div key={klass.id} className="py-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-foreground">{klass.name}</p>
                          <p className="text-sm font-semibold text-foreground">{score}%</p>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          {klass.studentCount} students · {klass.subjectCount} subjects
                        </p>
                      </div>
                    );
                  })}
              </Card>
            </section>

            <section className="space-y-3">
              <SectionHeader title="Recent quizzes" hint="Responses vs enrolled" />
              <Card className="divide-y divide-border px-5">
                {published.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{quiz.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {className(quiz.classId)} · {quiz.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BarChart3 className="size-4" />
                      <span className="font-semibold text-foreground">{quiz.responses ?? 0}</span>{" "}
                      responses
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
