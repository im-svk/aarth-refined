import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  FileText,
  LayoutGrid,
  NotebookPen,
  Presentation,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  FilterChips,
  ListRow,
  PageHeader,
  Pill,
  SectionHeader,
} from "@/components/aarth/primitives";
import { aiDocuments, classes, presentations, quizzes, relativeTime } from "@/data/mock";

export const Route = createFileRoute("/academic-tools")({
  head: () => ({
    meta: [
      { title: "Create Studio — Aarth Educator" },
      {
        name: "description",
        content:
          "One launcher for AI study material, quizzes, question papers, presentations and notes, scoped to your classes.",
      },
      { property: "og:title", content: "Create Studio — Aarth Educator" },
      {
        property: "og:description",
        content: "Start anything you teach with: notes, quizzes, papers, slides.",
      },
    ],
  }),
  component: CreateStudio;
});

const active = classes.filter((c) => !c.archived);

type Tool = {
  label: string;
  description: string;
  to: string;
  icon: typeof FileText;
  badge?: string;
};

const assessments: Tool[] = [
  {
    label: "Quiz",
    description: "AI questions with a share code for students",
    to: "/quizzes",
    icon: ClipboardList,
  },
  {
    label: "Question paper",
    description: "Blueprint-based exam paper with marks matrix",
    to: "/papers",
    icon: NotebookPen,
    badge: "Desktop editor",
  },
];

const materials: Tool[] = [
  {
    label: "Presentation",
    description: "Slide deck generated from a chapter",
    to: "/presentations",
    icon: Presentation,
    badge: "Desktop editor",
  },
  {
    label: "Assignment",
    description: "Homework, project, essay or lab report",
    to: "/assignments",
    icon: LayoutGrid,
    badge: "Plan",
  },
  {
    label: "Note",
    description: "Upload your own teaching file",
    to: "/notes",
    icon: StickyNote,
    badge: "On phone",
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link to={tool.to} className="press block">
      <Card interactive className="flex h-full items-start gap-3 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground">
          <tool.icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{tool.label}</p>
            {tool.badge && <Pill tone="outline">{tool.badge}</Pill>}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tool.description}</p>
        </div>
      </Card>
    </Link>
  );
}

function CreateStudio() {
  const [scope, setScope] = useState("all");

  const recents = [
    ...aiDocuments.slice(0, 2).map((d) => ({
      id: d.id,
      title: d.title,
      meta: `Study material · ${relativeTime(d.updatedAt)}`,
      to: "/aidocs" as const,
      icon: FileText,
    })),
    ...quizzes.slice(0, 1).map((q) => ({
      id: q.id,
      title: q.title,
      meta: `Quiz · ${q.questions} questions`,
      to: "/quizzes" as const,
      icon: ClipboardList,
    })),
    ...presentations.slice(0, 1).map((p) => ({
      id: p.id,
      title: p.title,
      meta: `Presentation · ${p.slides} slides`,
      to: "/presentations" as const,
      icon: Presentation,
    })),
  ];

  return (
    <AppShell title="Create">
      <div className="space-y-8">
        <PageHeader
          kicker="Create"
          title="Studio"
          subtitle="Pick an outcome — Aarth drafts it against your class, board and chapter, then you refine."
        />

        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">For</p>
          <FilterChips
            value={scope}
            onChange={setScope}
            options={[
              { value: "all", label: "All classes" },
              ...active.map((c) => ({ value: c.id, label: c.name.replace("Class ", "Cl. ") })),
            ]}
          />
        </div>

        <section>
          <SectionHeader title="AI study material" hint="Most used" />
          <Link to="/aidocs" className="press mt-3 block">
            <Card accent interactive className="p-5 pl-6 md:p-6 md:pl-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
                  <Sparkles className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="display text-2xl text-foreground">Generate study material</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Notes, chapter summaries and lesson plans in an A4 document you can edit and
                    share.
                  </p>
                </div>
                <Button className="md:w-auto">Open studio</Button>
              </div>
            </Card>
          </Link>
        </section>

        <section>
          <SectionHeader title="Assessments" hint="Test what was taught" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {assessments.map((tool) => (
              <ToolCard key={tool.label} tool={tool} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Class materials" hint="For the classroom" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((tool) => (
              <ToolCard key={tool.label} tool={tool} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Recent creations"
            action={
              <Link to="/aidocs" className="text-xs font-semibold text-primary">
                View all
              </Link>
            }
          />
          <Card className="mt-3">
            <div className="divide-y divide-border">
              {recents.map((item) => (
                <Link key={item.id} to={item.to}>
                  <ListRow
                    icon={<item.icon className="size-4" />}
                    title={item.title}
                    subtitle={item.meta}
                    onClick={() => {}}
                  />
                </Link>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
