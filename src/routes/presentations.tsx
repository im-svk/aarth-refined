import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Play, Plus, Presentation as PresentationIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  DesktopOnlyNotice,
  EmptyState,
  PageHeader,
  Pill,
  SearchField,
  Spinner,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import {
  chapters,
  classes,
  className,
  presentations,
  relativeTime,
  subjectsForClass,
} from "@/data/mock";

export const Route = createFileRoute("/presentations")({
  head: () => ({
    meta: [
      { title: "Presentations — Aarth Educator" },
      {
        name: "description",
        content:
          "Generate classroom slide decks from a chapter, edit them and present in full screen.",
      },
      { property: "og:title", content: "Presentations — Aarth Educator" },
      { property: "og:description", content: "Chapter-based slide decks for the classroom." },
    ],
  }),
  component: Presentations,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

function CreateDeckDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [classId, setClassId] = useState(classes[3]!.id);
  const [busy, setBusy] = useState(false);
  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Generate presentation"
      description="A deck with a title slide, concept slides, a worked example and a recap."
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
                toast.success("Deck generated — 14 slides");
              }, 1300);
            }}
          >
            {busy ? (
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
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Slides</span>
          <input type="number" defaultValue={14} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Tone</span>
          <select className={inputClass}>
            <option>Explanatory</option>
            <option>Revision</option>
            <option>Exam focus</option>
          </select>
        </label>
      </div>
    </ResponsiveDialog>
  );
}

function Presentations() {
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(false);

  const list = useMemo(
    () =>
      presentations.filter((deck) => deck.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <AppShell title="Presentations">
      <div className="space-y-6">
        <PageHeader
          kicker="Class materials"
          title="Presentations"
          subtitle="Slide decks built from the chapter you're teaching, ready to project."
          actions={
            <Button onClick={() => setDialog(true)}>
              <Plus className="size-4" /> New deck
            </Button>
          }
        />

        <DesktopOnlyNotice what="The slide editor" />

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search presentations"
          className="lg:w-80"
        />

        {list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<PresentationIcon className="size-5" />}
              title="No presentations yet"
              description="Generate a deck from a chapter and edit the slides before class."
              action={
                <Button onClick={() => setDialog(true)}>
                  <Plus className="size-4" /> New deck
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((deck) => (
              <Card key={deck.id} className="overflow-hidden">
                <div className="flex aspect-[16/9] items-end border-b border-border bg-muted/50 p-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {deck.subject}
                    </p>
                    <p className="display mt-1 text-lg leading-tight text-foreground">
                      {deck.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {className(deck.classId)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {deck.slides} slides · {relativeTime(deck.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone="outline">Deck</Pill>
                    <Button variant="outline" onClick={() => toast.success("Presenting")}>
                      <Play className="size-4" /> Present
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateDeckDialog open={dialog} onClose={() => setDialog(false)} />
    </AppShell>
  );
}
