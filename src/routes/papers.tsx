import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, NotebookPen, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  DesktopOnlyNotice,
  EmptyState,
  IconButton,
  PageHeader,
  Pill,
  SearchField,
  SegmentedToggle,
  Spinner,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { chapters, classes, className, formatDate, papers, subjectsForClass } from "@/data/mock";

export const Route = createFileRoute("/papers")({
  head: () => ({
    meta: [
      { title: "Question Papers — Aarth Educator" },
      {
        name: "description",
        content:
          "Build board-style question papers with a marks blueprint, then print or export for exams.",
      },
      { property: "og:title", content: "Question Papers — Aarth Educator" },
      {
        property: "og:description",
        content: "Board-style papers with a marks blueprint and print export.",
      },
    ],
  }),
  component: Papers,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

const BLUEPRINT = [
  { label: "Very short answer", count: 8, each: 1 },
  { label: "Short answer", count: 6, each: 2 },
  { label: "Long answer", count: 5, each: 5 },
  { label: "Case study", count: 2, each: 5 },
];

function CreatePaperDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [classId, setClassId] = useState(classes[3]!.id);
  const [busy, setBusy] = useState(false);
  const total = BLUEPRINT.reduce((sum, row) => sum + row.count * row.each, 0);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="New question paper"
      description="Pick the scope and a blueprint. The builder opens with drafted questions."
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
                toast.success("Paper drafted — opening builder");
              }, 1300);
            }}
          >
            {busy ? (
              <>
                <Spinner /> Drafting…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Create paper
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
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Exam type</span>
          <select className={inputClass}>
            <option>Unit test</option>
            <option>Mid-term</option>
            <option>Pre-board</option>
            <option>Annual</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">
            Duration (minutes)
          </span>
          <input type="number" defaultValue={180} className={inputClass} />
        </label>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-foreground">Chapters covered</p>
        <div className="space-y-2 rounded-xl border border-border p-3">
          {chapters.slice(0, 4).map((chapter) => (
            <label key={chapter.id} className="flex items-center gap-2 text-xs text-foreground">
              <input type="checkbox" defaultChecked className="size-4 accent-primary" />
              {chapter.name}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-foreground">Blueprint</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Section</th>
                <th className="px-3 py-2 text-right font-semibold">Qs</th>
                <th className="px-3 py-2 text-right font-semibold">Marks each</th>
                <th className="px-3 py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BLUEPRINT.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2 text-foreground">{row.label}</td>
                  <td className="px-3 py-2 text-right text-foreground">{row.count}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{row.each}</td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground">
                    {row.count * row.each}
                  </td>
                </tr>
              ))}
              <tr className="bg-muted/40">
                <td className="px-3 py-2 font-semibold text-foreground" colSpan={3}>
                  Total marks
                </td>
                <td className="px-3 py-2 text-right font-semibold text-primary">{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

function Papers() {
  const [tab, setTab] = useState<"all" | "draft" | "published">("all");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);

  const list = useMemo(
    () =>
      papers.filter(
        (paper) =>
          (tab === "all" || paper.status === tab) &&
          paper.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [tab, query],
  );

  return (
    <AppShell title="Question Papers">
      <div className="space-y-6">
        <PageHeader
          kicker="Assessments"
          title="Question papers"
          subtitle="Board-style papers with a marks blueprint, section ordering and print-ready output."
          actions={
            <Button onClick={() => setDialog(true)}>
              <Plus className="size-4" /> New paper
            </Button>
          }
        />

        <DesktopOnlyNotice what="paper builder" />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SegmentedToggle
            value={tab}
            onChange={setTab}
            options={[
              { value: "all", label: "All" },
              { value: "draft", label: "Drafts" },
              { value: "published", label: "Published" },
            ]}
          />
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search papers"
            className="lg:ml-auto lg:w-72"
          />
        </div>

        {list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<NotebookPen className="size-5" />}
              title="No question papers yet"
              description="Create a paper from a blueprint — Aarth drafts the questions, you refine and print."
              action={
                <Button onClick={() => setDialog(true)}>
                  <Plus className="size-4" /> New paper
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((paper) => (
              <Card key={paper.id} accent className="p-5 pl-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={paper.status === "published" ? "tint" : "outline"}>
                    {paper.status === "published" ? "Published" : "Draft"}
                  </Pill>
                  <Pill tone="outline">{paper.board}</Pill>
                </div>
                <h3 className="display mt-3 text-lg text-foreground">{paper.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {className(paper.classId)} · {paper.subject} · created {formatDate(paper.createdAt)}
                </p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">{paper.marks} marks</span> ·{" "}
                    {paper.duration} min
                  </p>
                  <div className="flex items-center gap-2">
                    <IconButton label="Download" onClick={() => toast.success("Exporting PDF")}>
                      <Download className="size-4" />
                    </IconButton>
                    <Button variant="outline" onClick={() => toast.success("Opening builder")}>
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreatePaperDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
