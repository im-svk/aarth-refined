import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/papers")({
  head: () => ({
    meta: [
      { title: "Question Papers — Aarth Educator" },
      { name: "description", content: "Question Papers in Aarth Educator." },
      { property: "og:title", content: "Question Papers — Aarth Educator" },
      { property: "og:description", content: "Question Papers in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Question Papers">
      <PageHeader kicker="Aarth" title="Question Papers" />
      <LoadingPanel />
    </AppShell>
  );
}
