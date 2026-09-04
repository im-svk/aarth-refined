import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Check, GraduationCap, School } from "lucide-react";
import { AuthLayout } from "@/components/aarth/app-shell";
import { Button, Card, Pill, Spinner } from "@/components/aarth/primitives";
import { INSTITUTION, classes } from "@/data/mock";

export const Route = createFileRoute("/join/$token")({
  head: () => ({
    meta: [
      { title: "Join a class — Aarth Educator" },
      {
        name: "description",
        content: "Accept your class invitation and join your teacher's workspace on Aarth Educator.",
      },
      { property: "og:title", content: "Join a class — Aarth Educator" },
      { property: "og:description", content: "Accept your class invitation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: JoinClass,
});

function JoinClass() {
  const { token } = Route.useParams();
  const klass = classes[3]!;
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  return (
    <AuthLayout>
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Class invitation
        </p>
        <h1 className="display mt-2 text-3xl text-foreground">Join this class</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You&apos;ve been invited to {klass.name} at {INSTITUTION.name}.
        </p>
      </div>
      <Card className="p-6">
        {state === "done" ? (
          <div className="text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
              <Check className="size-5" />
            </span>
            <h2 className="display mt-4 text-2xl text-foreground">You're in</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {klass.name} has been added to your classes. Your teacher will share material and
              quizzes here.
            </p>
            <div className="mt-6">
              <Link to="/dashboard">
                <Button className="w-full justify-center">Go to home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
                <School className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="display text-xl text-foreground">{klass.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {INSTITUTION.name} · {INSTITUTION.city}
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Board</dt>
                <dd className="font-semibold text-foreground">{klass.board}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Academic year</dt>
                <dd className="font-semibold text-foreground">{klass.academicYear}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Subjects</dt>
                <dd className="font-semibold text-foreground">{klass.subjectCount}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Invite code</dt>
                <dd className="font-mono text-[11px] text-foreground">{token}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
              <Pill tone="tint">
                <GraduationCap className="mr-1 inline size-3" /> {klass.studentCount} students
              </Pill>
              <Pill tone="outline">
                <BookMarked className="mr-1 inline size-3" /> {klass.teacherCount} teachers
              </Pill>
            </div>

            <div className="mt-6 space-y-2">
              <Button
                className="w-full justify-center"
                disabled={state === "busy"}
                onClick={() => {
                  setState("busy");
                  setTimeout(() => setState("done"), 1100);
                }}
              >
                {state === "busy" ? (
                  <>
                    <Spinner /> Joining…
                  </>
                ) : (
                  "Accept invitation"
                )}
              </Button>
              <Link to="/auth">
                <Button variant="ghost" className="w-full justify-center">
                  Not you? Sign in with another account
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
              Invitations expire 7 days after they're sent. Ask your teacher for a fresh link if this
              one has lapsed.
            </p>
          </>
        )}
      </Card>
    </AuthLayout>
  );
}
