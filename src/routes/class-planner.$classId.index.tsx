import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/class-planner/$classId")({
  head: () => ({
    meta: [
      { title: "Planner detail — Aarth Educator" },
      { name: "description", content: "Planner detail in Aarth Educator." },
      { property: "og:title", content: "Planner detail — Aarth Educator" },
      { property: "og:description", content: "Planner detail in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Planner detail">
      <PageHeader kicker="Aarth" title="Planner detail" />
      <LoadingPanel />
    </AppShell>
  );
}
