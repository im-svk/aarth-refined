import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Copy, Plus, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  FilterChips,
  PageHeader,
  Pill,
  SearchField,
  SegmentedToggle,
  Spinner,
  StatTile,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { chapters, classes, className, quizzes, subjectsForClass } from "@/data/mock";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title: "Quizzes — Aarth Educator" },
      {
        name: "description",
        content:
          "Create AI quizzes from any chapter, publish a share code and track student responses.",
      },
      { property: "og:title", content: "Quizzes — Aarth Educator" },
      { property: "og:description", content: "AI quizzes with share codes and response tracking." },
    ],
  }),
  component: Quizzes,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

const STATUS_LABEL = { draft: "Draft", published: "Published", closed: "Closed" } as const;

function CreateQuizDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [classId, setClassId] = useState(classes[3]!.id);
  const [count, setCount] = useState(15);
  const [difficulty, setDifficulty] = useState("mixed");
  const [busy, setBusy] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Create quiz"
      description="Questions are drafted from the chapter, then you can edit each one."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={busy}
            onClick={() => {
              setBusy(true);
              setTimeout(() => {
                setBusy(false);
                onClose();
                toast.success("Quiz drafted — 15 questions");
              }, 1300);
            }}
          >
            {busy ? (
              <>
                <Spinner /> Drafting…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate quiz
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
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
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject</span>
          <select className={inputClass}>
            {subjectsForClass(classId).map((subject) => (
              <option key={subject.id}>{subject.name}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Chapter</span>
          <select className={inputClass}>
            {chapters.map((chapter) => (
              <option key={chapter.id}>{chapter.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Questions</span>
          <input
            type="number"
            value={count}
            min={5}
            max={50}
            onChange={(event) => setCount(Number(event.target.value))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">
            Duration (minutes)
          </span>
          <input type="number" defaultValue={25} className={inputClass} />
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-foreground">Difficulty</p>
        <FilterChips
          value={difficulty}
          onChange={setDifficulty}
          options={[
            { value: "easy", label: "Easy" },
            { value: "mixed", label: "Mixed" },
            { value: "hard", label: "Hard" },
          ]}
        />
      </div>
    </ResponsiveDialog>
  );
}

function Quizzes() {
  const [tab, setTab] = useState<"all" | "published" | "draft" | "closed">("all");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);

  const list = useMemo(
    () =>
      quizzes.filter(
        (quiz) =>
          (tab === "all" || quiz.status === tab) &&
          quiz.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [tab, query],
  );

  const responses = quizzes.reduce((sum, quiz) => sum + (quiz.responses ?? 0), 0);

  return (
    <AppShell title="Quizzes">
      <div className="space-y-6">
        <PageHeader
          kicker="Assessments"
          title="Quizzes"
          subtitle="Short tests students can take with a share code. Results update as they submit."
          actions={
            <Button onClick={() => setDialog(true)}>
              <Plus className="size-4" /> Create quiz
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label="Quizzes" value={quizzes.length} icon={<ClipboardList className="size-4" />} />
          <StatTile
            label="Published"
            value={quizzes.filter((quiz) => quiz.status === "published").length}
          />
          <StatTile label="Responses" value={responses} icon={<Users className="size-4" />} />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SegmentedToggle
            value={tab}
            onChange={setTab}
            options={[
              { value: "all", label: "All" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Drafts" },
              { value: "closed", label: "Closed" },
            ]}
          />
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search quizzes"
            className="lg:ml-auto lg:w-72"
          />
        </div>

        {list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<ClipboardList className="size-5" />}
              title="No quizzes here"
              description="Generate a quiz from a chapter and publish it to your class with a share code."
              action={
                <Button onClick={() => setDialog(true)}>
                  <Plus className="size-4" /> Create quiz
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((quiz) => (
              <Card key={quiz.id} accent className="flex h-full flex-col p-5 pl-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={quiz.status === "published" ? "tint" : "outline"}>
                    {STATUS_LABEL[quiz.status]}
                  </Pill>
                  <Pill tone="outline">{quiz.subject}</Pill>
                </div>
                <h3 className="display mt-3 text-lg text-foreground">{quiz.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{className(quiz.classId)}</p>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
                  <div>
                    <dt>Questions</dt>
                    <dd className="text-sm font-semibold text-foreground">{quiz.questions}</dd>
                  </div>
                  <div>
                    <dt>Marks</dt>
                    <dd className="text-sm font-semibold text-foreground">{quiz.marks}</dd>
                  </div>
                  <div>
                    <dt>Minutes</dt>
                    <dd className="text-sm font-semibold text-foreground">{quiz.duration}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-1 items-end justify-between gap-2">
                  {quiz.shareCode ? (
                    <button
                      type="button"
                      onClick={() => toast.success(`Code ${quiz.shareCode} copied`)}
                      className="press inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 font-mono text-[11px] font-semibold text-foreground"
                    >
                      {quiz.shareCode}
                      <Copy className="size-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Not published</span>
                  )}
                  <Button variant="outline" onClick={() => toast.success(`Opening ${quiz.title}`)}>
                    {quiz.status === "draft" ? "Continue" : "Results"}
                  </Button>
                </div>
                {typeof quiz.responses === "number" && (
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {quiz.responses} responses received
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateQuizDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
