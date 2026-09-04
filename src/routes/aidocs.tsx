import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Pin, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  FilterChips,
  IconButton,
  ListRow,
  PageHeader,
  Pill,
  SearchField,
  SectionHeader,
  Skeleton,
  Spinner,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import {
  aiDocuments,
  chapters,
  classes,
  className,
  relativeTime,
  subjectsForClass,
} from "@/data/mock";

export const Route = createFileRoute("/aidocs")({
  head: () => ({
    meta: [
      { title: "AI Study Material — Aarth Educator" },
      {
        name: "description",
        content:
          "Generate chapter-accurate study notes, lesson plans and summaries as editable A4 documents.",
      },
      { property: "og:title", content: "AI Study Material — Aarth Educator" },
      {
        property: "og:description",
        content: "Chapter-accurate notes and lesson plans, ready to edit.",
      },
    ],
  }),
  component: StudyMaterial,
});

const TEMPLATE_LABEL: Record<string, string> = {
  blank: "Blank",
  question_paper: "Question paper",
  study_material: "Study material",
  lesson_plan: "Lesson plan",
  report: "Report",
};

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

function GenerateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [classId, setClassId] = useState(classes[3]!.id);
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState(chapters[2]!.name);
  const [template, setTemplate] = useState("study_material");
  const [depth, setDepth] = useState("standard");
  const [generating, setGenerating] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Generate study material"
      description="Aarth drafts from the prescribed textbook for the class and board you pick."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={generating}
            onClick={() => {
              setGenerating(true);
              setTimeout(() => {
                setGenerating(false);
                onClose();
                toast.success("Document ready to edit");
              }, 1400);
            }}
          >
            {generating ? (
              <>
                <Spinner /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate
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
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className={inputClass}
          >
            {subjectsForClass(classId).map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Chapter</span>
          <select
            value={chapter}
            onChange={(event) => setChapter(event.target.value)}
            className={inputClass}
          >
            {chapters.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-foreground">Template</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {["study_material", "lesson_plan", "report", "blank"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTemplate(value)}
              className={`press rounded-xl border px-3 py-3 text-left text-xs font-semibold ${
                template === value
                  ? "border-primary/40 bg-tint text-tint-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {TEMPLATE_LABEL[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-foreground">Depth</p>
        <FilterChips
          value={depth}
          onChange={setDepth}
          options={[
            { value: "brief", label: "Brief" },
            { value: "standard", label: "Standard" },
            { value: "detailed", label: "Detailed" },
          ]}
        />
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold text-foreground">
          Extra instructions
        </span>
        <textarea
          rows={3}
          placeholder="Add numericals with IST-friendly examples, and a 5-question recap at the end."
          className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary/50"
        />
      </label>
    </ResponsiveDialog>
  );
}

function StudyMaterial() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [dialog, setDialog] = useState(false);
  const [loading] = useState(false);

  const docs = useMemo(
    () =>
      aiDocuments.filter(
        (doc) =>
          (scope === "all" || doc.classId === scope) &&
          doc.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, scope],
  );

  const pinned = docs.filter((doc) => doc.pinned);
  const rest = docs.filter((doc) => !doc.pinned);

  return (
    <AppShell title="Study Material">
      <div className="space-y-6">
        <PageHeader
          kicker="Create"
          title="Study material"
          subtitle="Editable A4 documents generated from your prescribed textbooks."
          actions={
            <Button onClick={() => setDialog(true)}>
              <Sparkles className="size-4" /> Generate
            </Button>
          }
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search documents"
            className="lg:w-80"
          />
          <FilterChips
            value={scope}
            onChange={setScope}
            className="lg:ml-auto"
            options={[
              { value: "all", label: "All classes" },
              ...classes
                .filter((klass) => !klass.archived)
                .map((klass) => ({
                  value: klass.id,
                  label: klass.name.replace("Class ", "Cl. "),
                })),
            ]}
          />
        </div>

        {loading ? (
          <Card className="divide-y divide-border">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="mt-2 h-3 w-1/4" />
                </div>
              </div>
            ))}
          </Card>
        ) : docs.length === 0 ? (
          <Card>
            <EmptyState
              icon={<FileText className="size-5" />}
              title="No documents yet"
              description="Generate notes, a chapter summary or a lesson plan and it will appear here."
              action={
                <Button onClick={() => setDialog(true)}>
                  <Plus className="size-4" /> New document
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-6">
            {pinned.length > 0 && (
              <section>
                <SectionHeader title="Pinned" hint="Quick access" />
                <Card className="mt-3 divide-y divide-border">
                  {pinned.map((doc) => (
                    <ListRow
                      key={doc.id}
                      icon={<Pin className="size-4" />}
                      title={doc.title}
                      subtitle={`${className(doc.classId)} · ${doc.subject} · ${relativeTime(doc.updatedAt)}`}
                      trailing={<Pill tone="outline">{TEMPLATE_LABEL[doc.template]}</Pill>}
                      onClick={() => toast.success(`Opening ${doc.title}`)}
                    />
                  ))}
                </Card>
              </section>
            )}

            <section>
              <SectionHeader title="All documents" hint={`${rest.length} documents`} />
              <Card className="mt-3 divide-y divide-border">
                {rest.map((doc) => (
                  <ListRow
                    key={doc.id}
                    icon={<FileText className="size-4" />}
                    title={doc.title}
                    subtitle={`${className(doc.classId)} · ${doc.subject} · ${relativeTime(doc.updatedAt)}`}
                    showChevron={false}
                    trailing={
                      <div className="flex items-center gap-2">
                        <Pill tone="outline">{TEMPLATE_LABEL[doc.template]}</Pill>
                        <IconButton label="Delete" onClick={() => toast.success("Document deleted")}>
                          <Trash2 className="size-4" />
                        </IconButton>
                      </div>
                    }
                  />
                ))}
              </Card>
            </section>
          </div>
        )}
      </div>

      <GenerateDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
