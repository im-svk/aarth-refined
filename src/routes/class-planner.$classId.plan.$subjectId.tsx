import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/class-planner/$classId/plan/$subjectId")({
  head: () => ({
    meta: [
      { title: "Subject planner — Aarth Educator" },
      { name: "description", content: "Subject planner in Aarth Educator." },
      { property: "og:title", content: "Subject planner — Aarth Educator" },
      { property: "og:description", content: "Subject planner in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Subject planner">
      <PageHeader kicker="Aarth" title="Subject planner" />
      <LoadingPanel />
    </AppShell>
  );
}
