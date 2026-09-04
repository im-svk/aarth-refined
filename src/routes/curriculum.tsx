import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Layers } from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Card,
  EmptyState,
  FilterChips,
  ListRow,
  PageHeader,
  Pill,
  SectionHeader,
  StatTile,
} from "@/components/aarth/primitives";
import { chapters, classes, subjectsForClass } from "@/data/mock";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: "Curriculum — Aarth Educator" },
      {
        name: "description",
        content:
          "Chapter-by-chapter syllabus coverage across your classes and subjects for the term.",
      },
      { property: "og:title", content: "Curriculum — Aarth Educator" },
      { property: "og:description", content: "Syllabus coverage across classes and subjects." },
    ],
  }),
  component: Curriculum,
});

const STATUS_LABEL: Record<string, string> = {
  done: "Completed",
  in_progress: "Teaching now",
  pending: "Not started",
};

function Curriculum() {
  const active = classes.filter((klass) => !klass.archived);
  const [classId, setClassId] = useState(active[0]!.id);
  const subjects = subjectsForClass(classId);
  const done = chapters.filter((chapter) => chapter.status === "done").length;

  return (
    <AppShell title="Curriculum">
      <div className="space-y-6">
        <PageHeader
          kicker="Teach"
          title="Curriculum"
          subtitle="Where each subject stands against the board syllabus this term."
          actions={<Pill tone="outline">Term 1 · 2026–27</Pill>}
        />

        <FilterChips
          value={classId}
          onChange={setClassId}
          options={active.map((klass) => ({ value: klass.id, label: klass.name }))}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label="Subjects" value={subjects.length} hint="Mapped to this class" />
          <StatTile
            label="Chapters completed"
            value={`${done}/${chapters.length}`}
            hint="Physics — sample subject"
          />
          <StatTile label="Weeks remaining" value={8} hint="Until term end" />
        </div>

        <section className="space-y-3">
          <SectionHeader title="Subjects" hint="Open a subject to manage modules" />
          <Card>
            {subjects.length === 0 ? (
              <EmptyState
                icon={<Layers className="size-5" />}
                title="No subjects yet"
                description="Add subjects to this class to start mapping the curriculum."
              />
            ) : (
              <div className="divide-y divide-border">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id}
                    to="/classes/$classId/subjects/$subjectId"
                    params={{ classId, subjectId: subject.id }}
                  >
                    <ListRow
                      interactive
                      icon={<BookMarked className="size-4" />}
                      title={subject.name}
                      subtitle={`${subject.moduleCount} modules · ${subject.fileCount} files`}
                    />
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Chapter coverage" hint="Physics · NCERT Class 11" />
          <Card className="divide-y divide-border px-5">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="flex items-center gap-3 py-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
                  {chapter.index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{chapter.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {chapter.weeks} weeks · planned {chapter.plannedStart}
                  </p>
                </div>
                <Pill tone={chapter.status === "in_progress" ? "tint" : "outline"}>
                  {STATUS_LABEL[chapter.status]}
                </Pill>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
