import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Library — Aarth Educator" },
      { name: "description", content: "Library in Aarth Educator." },
      { property: "og:title", content: "Library — Aarth Educator" },
      { property: "og:description", content: "Library in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Library">
      <PageHeader kicker="Aarth" title="Library" />
      <LoadingPanel />
    </AppShell>
  );
}
