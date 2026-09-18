import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, FileText, LockKeyhole, Search, Share2 } from "lucide-react";
import { AuthLayout } from "@/components/aarth/app-shell";
import { Button, Card, ListRow, Pill } from "@/components/aarth/primitives";
import { INSTITUTION, className, formatDate, libraryFiles, subjects } from "@/data/mock";

export const Route = createFileRoute("/student-view")({
  head: () => ({
    meta: [
      { title: "Student notes access — Aarth Notes AI" },
      { name: "description", content: "Students can enter a class code to read notes shared by their teacher." },
      { property: "og:title", content: "Student notes access — Aarth Notes AI" },
      { property: "og:description", content: "Read teacher-shared notes using a class code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentView,
});

const VALID_CODES = ["SV-11A", "SV-10A", "SV-NOTES"];

function StudentView() {
  const [code, setCode] = useState("SV-11A");
  const [query, setQuery] = useState("");
  const [entered, setEntered] = useState(true);
  const normalised = code.trim().toUpperCase();
  const unlocked = entered && VALID_CODES.includes(normalised);

  const sharedNotes = useMemo(
    () => libraryFiles.filter((file) => file.shared && file.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <AuthLayout>
      <div className="space-y-5">
        <div className="text-center sm:text-left">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:mx-0">
            <BookOpenCheck className="size-6" />
          </span>
          <h1 className="display mt-5 text-[1.8rem] leading-tight text-foreground sm:text-[2.2rem]">
            Student notes
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Enter the class code from your teacher to view shared notes from {INSTITUTION.name}.
          </p>
        </div>

        <Card className="p-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Class code</span>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setEntered(false);
                }}
                placeholder="SV-11A"
                className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-card px-3 font-mono text-sm text-foreground outline-none focus:border-primary/50"
              />
              <Button onClick={() => setEntered(true)} className="rounded-xl">Open</Button>
            </div>
          </label>
        </Card>

        {!unlocked ? (
          <Card className="p-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <LockKeyhole className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">Enter a valid class code</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              For this demo, try <span className="font-mono text-foreground">SV-11A</span> or <span className="font-mono text-foreground">SV-10A</span>.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground">
                  <Share2 className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{className(normalised === "SV-10A" ? "c10a" : "c11s")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Teacher-shared notes only</p>
                </div>
                <Pill tone="tint">{normalised}</Pill>
              </div>
            </Card>

            <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 focus-within:border-primary/40">
              <Search className="size-[18px] shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search shared notes"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </label>

            <Card className="overflow-hidden">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Shared notes</p>
                <p className="text-xs text-muted-foreground">{sharedNotes.length} available</p>
              </div>
              <div className="divide-y divide-border">
                {sharedNotes.map((file) => {
                  const subject = subjects.find((item) => item.id === file.subjectId);
                  return (
                    <ListRow
                      key={file.id}
                      icon={<FileText className="size-4" />}
                      title={file.name}
                      subtitle={`${subject?.name ?? "Notes"} · ${formatDate(file.uploadedAt)}`}
                      trailing={<Pill tone="outline">Read</Pill>}
                      showChevron={false}
                    />
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        <div className="text-center">
          <Link to="/auth" className="text-xs font-semibold text-primary">Teacher login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
