import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BookOpen,
  Files,
  Layers,
  Mail,
  Plus,
  UserSquare2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  ListRow,
  PageHeader,
  PersonRow,
  Pill,
  SearchField,
  SectionHeader,
  SegmentedToggle,
  StatTile,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { useApp } from "@/lib/app-context";
import {
  classById,
  libraryFiles,
  studentsForClass,
  subjectsForClass,
  teachersForClass,
} from "@/data/mock";

export const Route = createFileRoute("/classes/$classId/")({
  loader: ({ params }) => {
    const klass = classById(params.classId);
    if (!klass) throw notFound();
    return { klass };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Class unavailable — Aarth Educator" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.klass.name} — Aarth Educator`;
    const description = `Curriculum, students and faculty for ${loaderData.klass.name} (${loaderData.klass.board}).`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ClassWorkspace,
});

type Tab = "curriculum" | "students" | "teachers";

function ClassWorkspace() {
  const { klass } = Route.useLoaderData();
  const { isAdmin } = useApp();
  const [tab, setTab] = useState<Tab>("curriculum");
  const [query, setQuery] = useState("");
  const [subjectDialog, setSubjectDialog] = useState(false);
  const [subjectName, setSubjectName] = useState("");

  const classSubjects = subjectsForClass(klass.id);
  const classStudents = studentsForClass(klass.id);
  const classTeachers = teachersForClass(klass.id);
  const fileCount = libraryFiles.filter((file) =>
    classSubjects.some((subject) => subject.id === file.subjectId),
  ).length;

  const filter = <T extends { name: string }>(items: T[]) =>
    items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell title={klass.name} back="/classes">
      <div className="space-y-6">
        <PageHeader
          kicker={
            <>
              <Link to="/classes" className="hover:text-foreground">
                Classes
              </Link>{" "}
              · {klass.academicYear}
            </>
          }
          title={klass.name}
          subtitle={klass.description}
          actions={
            <>
              <Pill tone="tint">{klass.board}</Pill>
              {klass.stream && <Pill tone="outline">{klass.stream}</Pill>}
              <Pill tone="outline">{klass.term}</Pill>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Subjects" value={classSubjects.length} icon={<BookOpen className="size-4" />} />
          <StatTile label="Students" value={klass.studentCount} icon={<Users className="size-4" />} />
          <StatTile label="Faculty" value={classTeachers.length} icon={<UserSquare2 className="size-4" />} />
          <StatTile label="Library files" value={fileCount} icon={<Files className="size-4" />} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SegmentedToggle
            value={tab}
            onChange={setTab}
            options={[
              { value: "curriculum", label: "Curriculum" },
              { value: "students", label: "Students" },
              { value: "teachers", label: "Teachers" },
            ]}
          />
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={`Search ${tab}`}
            className="sm:w-64 sm:ml-auto"
          />
        </div>

        {tab === "curriculum" && (
          <section>
            <SectionHeader
              title="Subjects"
              hint={`${classSubjects.length} in ${klass.term}`}
              action={
                isAdmin ? (
                  <Button variant="outline" onClick={() => setSubjectDialog(true)}>
                    <Plus className="size-4" /> Add subject
                  </Button>
                ) : undefined
              }
            />
            {filter(classSubjects).length === 0 ? (
              <Card className="mt-3">
                <EmptyState
                  icon={<BookOpen className="size-5" />}
                  title="No subjects yet"
                  description="Add the subjects taught in this class to start building modules and material."
                  action={
                    isAdmin ? (
                      <Button onClick={() => setSubjectDialog(true)}>
                        <Plus className="size-4" /> Add subject
                      </Button>
                    ) : undefined
                  }
                />
              </Card>
            ) : (
              <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filter(classSubjects).map((subject) => (
                  <Link
                    key={subject.id}
                    to="/classes/$classId/subjects/$subjectId"
                    params={{ classId: klass.id, subjectId: subject.id }}
                    className="press block"
                  >
                    <Card accent interactive className="h-full p-5 pl-6">
                      <h3 className="display text-lg text-foreground">{subject.name}</h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {subject.description}
                      </p>
                      <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="size-3.5" /> {subject.moduleCount} modules
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Files className="size-3.5" /> {subject.fileCount} files
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "students" && (
          <section>
            <SectionHeader
              title="Students"
              hint={`${classStudents.length} shown of ${klass.studentCount}`}
              action={
                isAdmin ? (
                  <Link to="/students">
                    <Button variant="outline">
                      <Mail className="size-4" /> Invite students
                    </Button>
                  </Link>
                ) : undefined
              }
            />
            <Card className="mt-3">
              {filter(classStudents).length === 0 ? (
                <EmptyState
                  icon={<Users className="size-5" />}
                  title="No students matched"
                  description="Try a different name, or invite students to this class."
                />
              ) : (
                <div className="divide-y divide-border">
                  {filter(classStudents).map((student) => (
                    <PersonRow
                      key={student.id}
                      name={student.name}
                      subtitle={`Roll ${student.rollNumber} · ${student.email}`}
                      trailing={student.invited ? <Pill tone="outline">Invited</Pill> : undefined}
                    />
                  ))}
                </div>
              )}
            </Card>
          </section>
        )}

        {tab === "teachers" && (
          <section>
            <SectionHeader
              title="Faculty"
              hint={`${classTeachers.length} assigned`}
              action={
                isAdmin ? (
                  <Link to="/teachers">
                    <Button variant="outline">
                      <UserSquare2 className="size-4" /> Manage faculty
                    </Button>
                  </Link>
                ) : undefined
              }
            />
            <Card className="mt-3">
              {filter(classTeachers).length === 0 ? (
                <EmptyState
                  icon={<UserSquare2 className="size-5" />}
                  title="No faculty assigned"
                  description="Assign teachers so they can create material for this class."
                />
              ) : (
                <div className="divide-y divide-border">
                  {filter(classTeachers).map((teacher) => (
                    <PersonRow
                      key={teacher.id}
                      name={teacher.name}
                      subtitle={`${teacher.title} · ${teacher.specializations.join(", ")}`}
                      trailing={<Pill tone="tint">{teacher.department}</Pill>}
                    />
                  ))}
                </div>
              )}
            </Card>
          </section>
        )}
      </div>

      <ResponsiveDialog
        open={subjectDialog}
        onClose={() => setSubjectDialog(false)}
        title="Add subject"
        description={`Suggested from the ${klass.board} syllabus for Class ${klass.grade}.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSubjectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSubjectDialog(false);
                toast.success("Subject added");
              }}
            >
              Add subject
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject name</span>
          <input
            value={subjectName}
            onChange={(event) => setSubjectName(event.target.value)}
            placeholder="Physics"
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary/50"
          />
        </label>
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Quick add</p>
          <div className="divide-y divide-border rounded-xl border border-border">
            {["Physics", "Chemistry", "Mathematics", "Biology"].map((name) => (
              <ListRow
                key={name}
                title={name}
                subtitle={`${klass.board} · Class ${klass.grade}`}
                showChevron={false}
                onClick={() => setSubjectName(name)}
              />
            ))}
          </div>
        </div>
      </ResponsiveDialog>
    </AppShell>
  );
}
