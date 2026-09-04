import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ClipboardList,
  Download,
  FileText,
  Layers,
  Plus,
  Presentation,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  IconButton,
  ListRow,
  PageHeader,
  Pill,
  SectionHeader,
  SegmentedToggle,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import {
  classById,
  formatDate,
  libraryFiles,
  modules,
  subjects,
} from "@/data/mock";

export const Route = createFileRoute("/classes/$classId/subjects/$subjectId")({
  loader: ({ params }) => {
    const klass = classById(params.classId);
    const subject = subjects.find((item) => item.id === params.subjectId);
    if (!klass || !subject) throw notFound();
    return { klass, subject };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Subject unavailable — Aarth Educator" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.subject.name} · ${loaderData.klass.name} — Aarth Educator`;
    const description = `Modules, notes and generated material for ${loaderData.subject.name} in ${loaderData.klass.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SubjectWorkspace,
});

function SubjectWorkspace() {
  const { klass, subject } = Route.useLoaderData();
  const [tab, setTab] = useState<"modules" | "files">("modules");
  const [dialog, setDialog] = useState(false);
  const [name, setName] = useState("");

  const subjectModules = modules.filter((item) => item.subjectId === subject.id);
  const files = libraryFiles.filter((file) => file.subjectId === subject.id);

  return (
    <AppShell title={subject.name} back>
      <div className="space-y-6">
        <PageHeader
          kicker={
            <>
              <Link to="/classes" className="hover:text-foreground">
                Classes
              </Link>{" "}
              ·{" "}
              <Link
                to="/classes/$classId"
                params={{ classId: klass.id }}
                className="hover:text-foreground"
              >
                {klass.name}
              </Link>
            </>
          }
          title={subject.name}
          subtitle={subject.description}
          actions={
            <>
              <Button variant="outline" onClick={() => setDialog(true)}>
                <Plus className="size-4" /> Add module
              </Button>
              <Link to="/aidocs">
                <Button>
                  <Sparkles className="size-4" /> Generate material
                </Button>
              </Link>
            </>
          }
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/aidocs" className="press">
            <Card interactive className="flex items-center gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-tint text-tint-foreground">
                <FileText className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">Study material</span>
            </Card>
          </Link>
          <Link to="/quizzes" className="press">
            <Card interactive className="flex items-center gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-tint text-tint-foreground">
                <ClipboardList className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">Quiz</span>
            </Card>
          </Link>
          <Link to="/presentations" className="press">
            <Card interactive className="flex items-center gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-tint text-tint-foreground">
                <Presentation className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">Presentation</span>
            </Card>
          </Link>
        </div>

        <SegmentedToggle
          value={tab}
          onChange={setTab}
          options={[
            { value: "modules", label: `Modules (${subjectModules.length})` },
            { value: "files", label: `Files (${files.length})` },
          ]}
        />

        {tab === "modules" ? (
          <section>
            <SectionHeader title="Modules" hint={`${klass.board} sequence`} />
            <Card className="mt-3">
              {subjectModules.length === 0 ? (
                <EmptyState
                  icon={<Layers className="size-5" />}
                  title="No modules yet"
                  description="Break the syllabus into modules so material and planning stay organised."
                  action={
                    <Button onClick={() => setDialog(true)}>
                      <Plus className="size-4" /> Add module
                    </Button>
                  }
                />
              ) : (
                <div className="divide-y divide-border">
                  {subjectModules.map((module) => (
                    <ListRow
                      key={module.id}
                      icon={<span className="text-xs font-bold">{module.index}</span>}
                      title={module.name}
                      subtitle={module.description}
                      trailing={<Pill tone="outline">{module.noteCount} notes</Pill>}
                      onClick={() => toast.success(`Opening ${module.name}`)}
                    />
                  ))}
                </div>
              )}
            </Card>
          </section>
        ) : (
          <section>
            <SectionHeader
              title="Subject files"
              hint="Visible to this class"
              action={
                <Button variant="outline" onClick={() => toast.success("Upload started")}>
                  <Upload className="size-4" /> Upload
                </Button>
              }
            />
            <Card className="mt-3">
              {files.length === 0 ? (
                <EmptyState
                  icon={<Upload className="size-5" />}
                  title="No files uploaded"
                  description="Upload worksheets, lab sheets or reference PDFs for this subject."
                  action={
                    <Button onClick={() => toast.success("Upload started")}>
                      <Upload className="size-4" /> Upload file
                    </Button>
                  }
                />
              ) : (
                <div className="divide-y divide-border">
                  {files.map((file) => (
                    <ListRow
                      key={file.id}
                      icon={<FileText className="size-4" />}
                      title={file.name}
                      subtitle={`${file.size} · ${formatDate(file.uploadedAt)}`}
                      showChevron={false}
                      trailing={
                        <div className="flex items-center gap-2">
                          {file.shared && <Pill tone="tint">Shared</Pill>}
                          <IconButton
                            label="Download"
                            onClick={() => toast.success("Downloading")}
                          >
                            <Download className="size-4" />
                          </IconButton>
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </Card>
          </section>
        )}
      </div>

      <ResponsiveDialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Add module"
        description={`Added to ${subject.name} · ${klass.name}.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDialog(false);
                toast.success("Module added");
              }}
            >
              Add module
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Module name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Laws of Motion"
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary/50"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Description</span>
          <textarea
            rows={3}
            placeholder="Newton's laws, friction, circular motion."
            className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary/50"
          />
        </label>
      </ResponsiveDialog>
    </AppShell>
  );
}
