import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — Aarth Educator" },
      { name: "description", content: "Assignments in Aarth Educator." },
      { property: "og:title", content: "Assignments — Aarth Educator" },
      { property: "og:description", content: "Assignments in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Assignments">
      <PageHeader kicker="Aarth" title="Assignments" />
      <LoadingPanel />
    </AppShell>
  );
}
