import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { INSTITUTION } from "@/data/mock";
import { Button, Card, Pill } from "@/components/aarth/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Institution setup — Aarth Educator" },
      {
        name: "description",
        content: "Choose the grades and boards your institution teaches to finish Aarth setup.",
      },
      { property: "og:title", content: "Institution setup — Aarth Educator" },
      { property: "og:description", content: "One step: pick your grades and board." },
    ],
  }),
  component: Onboarding,
});

const GRADES = [8, 9, 10, 11, 12];
const BOARDS = ["CBSE / NCERT", "Karnataka State (KTBS)"];

function Tile({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press relative flex min-h-[4.5rem] items-center justify-center rounded-xl border px-4 text-sm font-semibold",
        selected
          ? "border-primary/40 bg-tint text-tint-foreground"
          : "border-border bg-card text-foreground hover:border-primary/25",
      )}
    >
      {label}
      {selected && (
        <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </span>
      )}
    </button>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<number[]>([9, 10]);
  const [boards, setBoards] = useState<string[]>(["CBSE / NCERT"]);

  const toggle = <T,>(list: T[], set: (v: T[]) => void, item: T) =>
    set(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  const selected = [...grades.map((g) => `Class ${g}`), ...boards];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          {INSTITUTION.logoInitials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{INSTITUTION.name}</p>
          <p className="text-[11px] text-muted-foreground">Step 1 of 1 · Setup</p>
        </div>
        <Link to="/dashboard" className="text-xs font-semibold text-muted-foreground">
          Skip for now
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-32 pt-8 md:px-8">
        <p className="eyebrow text-muted-foreground">
          Welcome, Rajesh
        </p>
        <h1 className="display mt-2 text-4xl text-foreground">
          What does {INSTITUTION.short} <em className="text-primary">teach</em>?
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Pick the grades and boards you offer. This shapes textbook suggestions and AI generation
          defaults — you can change it anytime in Settings.
        </p>

        <section className="mt-9">
          <h2 className="text-sm font-semibold text-foreground">Grades offered</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {GRADES.map((grade) => (
              <Tile
                key={grade}
                label={`Class ${grade}`}
                selected={grades.includes(grade)}
                onClick={() => toggle(grades, setGrades, grade)}
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-foreground">Board</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {BOARDS.map((board) => (
              <Tile
                key={board}
                label={board}
                selected={boards.includes(board)}
                onClick={() => toggle(boards, setBoards, board)}
              />
            ))}
          </div>
        </section>

        <Card className="mt-8 p-4">
          <p className="text-xs font-semibold text-foreground">Selected</p>
          {selected.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Nothing selected yet — that's fine, you can skip this step.
            </p>
          ) : (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {selected.map((item) => (
                <Pill key={item} tone="tint">
                  {item}
                </Pill>
              ))}
            </div>
          )}
        </Card>
      </main>

      <div
        className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 py-4 backdrop-blur md:px-8"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Button variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
            Skip & go to dashboard
          </Button>
          <Button className="ml-auto" onClick={() => navigate({ to: "/classes" })}>
            Complete setup <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
