import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, FileText } from "lucide-react";
import { AuthLayout } from "@/components/aarth/app-shell";
import { Button, Card, ListRow, Pill } from "@/components/aarth/primitives";
import { INSTITUTION, formatDate, libraryFiles, subjects } from "@/data/mock";

export const Route = createFileRoute("/join/")({
  head: () => ({
    meta: [
      { title: "Shared class notes — Aarth Notes AI" },
      {
        name: "description",
        content: "Open teacher-shared notes using a class code on Aarth Notes AI.",
      },
      { property: "og:title", content: "Shared class notes — Aarth Notes AI" },
      { property: "og:description", content: "Read notes shared by your teacher." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: JoinClass,
});

function JoinClass() {
  const { token } = Route.useParams();
  const [opened, setOpened] = useState(false);
  const sharedNotes = libraryFiles.filter((file) => file.shared);

  return (
    <AuthLayout>
      <div className="space-y-5">
        <div className="text-center sm:text-left">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:mx-0">
            <BookOpenCheck className="size-6" />
          </span>
          <h1 className="display mt-5 text-[1.8rem] leading-tight text-foreground">Shared class notes</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {INSTITUTION.name} notes are available for this class code.
          </p>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Class code</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-foreground">{token}</p>
            </div>
            <Pill tone="tint">Student access</Pill>
          </div>
          {!opened && (
            <Button onClick={() => setOpened(true)} className="mt-5 w-full rounded-full">
              Open notes
            </Button>
          )}
        </Card>

        {opened && (
          <Card className="overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Shared notes</p>
              <p className="text-xs text-muted-foreground">Read-only material from your teacher</p>
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
        )}

        <div className="text-center">
          <Link to="/student-view" className="text-xs font-semibold text-primary">Enter another code</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
