import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/presentations")({
  head: () => ({
    meta: [
      { title: "Presentations — Aarth Educator" },
      { name: "description", content: "Presentations in Aarth Educator." },
      { property: "og:title", content: "Presentations — Aarth Educator" },
      { property: "og:description", content: "Presentations in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Presentations">
      <PageHeader kicker="Aarth" title="Presentations" />
      <LoadingPanel />
    </AppShell>
  );
}
