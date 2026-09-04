import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/class-planner/")({
  head: () => ({
    meta: [
      { title: "Class Planner — Aarth Educator" },
      { name: "description", content: "Class Planner in Aarth Educator." },
      { property: "og:title", content: "Class Planner — Aarth Educator" },
      { property: "og:description", content: "Class Planner in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Class Planner">
      <PageHeader kicker="Aarth" title="Class Planner" />
      <LoadingPanel />
    </AppShell>
  );
}
