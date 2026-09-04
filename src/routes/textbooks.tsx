import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Check, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  FilterChips,
  ListRow,
  PageHeader,
  Pill,
  SearchField,
  SectionHeader,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { chapters, textbooks, type TextbookRecord } from "@/data/mock";

export const Route = createFileRoute("/textbooks")({
  head: () => ({
    meta: [
      { title: "Academic Textbooks — Aarth Educator" },
      {
        name: "description",
        content:
          "NCERT and Karnataka State textbooks for grades 8–12, with chapters you can generate material from.",
      },
      { property: "og:title", content: "Academic Textbooks — Aarth Educator" },
      {
        property: "og:description",
        content: "Board-accurate textbooks and chapters for grades 8–12.",
      },
    ],
  }),
  component: Textbooks,
});

function Textbooks() {
  const [query, setQuery] = useState("");
  const [board, setBoard] = useState("all");
  const [grade, setGrade] = useState("all");
  const [selected, setSelected] = useState<TextbookRecord | null>(null);

  const list = useMemo(
    () =>
      textbooks.filter(
        (book) =>
          (board === "all" || book.board === board) &&
          (grade === "all" || String(book.grade) === grade) &&
          `${book.title} ${book.subject}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [board, grade, query],
  );

  return (
    <AppShell title="Textbooks">
      <div className="space-y-6">
        <PageHeader
          kicker="Library"
          title="Academic textbooks"
          subtitle="Prescribed books for grades 8–12. Open one to pick chapters for study material, quizzes or papers."
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search textbooks or subjects"
            className="lg:w-80"
          />
          <FilterChips
            value={board}
            onChange={setBoard}
            options={[
              { value: "all", label: "All boards" },
              { value: "NCERT", label: "NCERT" },
              { value: "Karnataka State", label: "Karnataka State" },
            ]}
          />
          <FilterChips
            value={grade}
            onChange={setGrade}
            className="lg:ml-auto"
            options={[
              { value: "all", label: "All grades" },
              ...[8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Class ${g}` })),
            ]}
          />
        </div>

        {list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<BookOpen className="size-5" />}
              title="No textbook matched"
              description="Clear a filter, or search a subject like Physics or Kannada."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setBoard("all");
                    setGrade("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((book) => (
              <Card key={book.id} accent className="flex h-full flex-col p-5 pl-6">
                <div className="flex flex-wrap gap-2">
                  <Pill tone="tint">Class {book.grade}</Pill>
                  <Pill tone="outline">{book.board}</Pill>
                </div>
                <h3 className="display mt-3 text-lg text-foreground">{book.title}</h3>
                <p className="mt-1.5 flex-1 text-xs text-muted-foreground">{book.subject}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" onClick={() => setSelected(book)}>
                    View chapters
                  </Button>
                  {book.inLibrary ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <Check className="size-3.5" /> In library
                    </span>
                  ) : (
                    <Button variant="ghost" onClick={() => toast.success("Added to library")}>
                      <Plus className="size-4" /> Add
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ResponsiveDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Chapters"}
        description={
          selected ? `${selected.board} · Class ${selected.grade} · ${selected.subject}` : undefined
        }
        size="lg"
        footer={
          <Button
            onClick={() => {
              setSelected(null);
              toast.success("Opening Create Studio with this chapter");
            }}
          >
            <Sparkles className="size-4" /> Generate material
          </Button>
        }
      >
        <SectionHeader title="Chapters" hint={`${chapters.length} listed`} />
        <div className="mt-3 divide-y divide-border rounded-xl border border-border">
          {chapters.map((chapter) => (
            <ListRow
              key={chapter.id}
              icon={<span className="text-xs font-bold">{chapter.index}</span>}
              title={chapter.name}
              subtitle={`${chapter.weeks} weeks · planned ${chapter.plannedStart}`}
              onClick={() => toast.success(`${chapter.name} selected`)}
            />
          ))}
        </div>
      </ResponsiveDialog>
    </AppShell>
  );
}
