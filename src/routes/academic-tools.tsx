import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/academic-tools")({
  head: () => ({
    meta: [
      { title: "Create Studio — Aarth Educator" },
      { name: "description", content: "Create Studio in Aarth Educator." },
      { property: "og:title", content: "Create Studio — Aarth Educator" },
      { property: "og:description", content: "Create Studio in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Create Studio">
      <PageHeader kicker="Aarth" title="Create Studio" />
      <LoadingPanel />
    </AppShell>
  );
}
