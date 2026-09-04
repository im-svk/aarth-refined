import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Aarth Educator" },
      { name: "description", content: "Analytics in Aarth Educator." },
      { property: "og:title", content: "Analytics — Aarth Educator" },
      { property: "og:description", content: "Analytics in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Analytics">
      <PageHeader kicker="Aarth" title="Analytics" />
      <LoadingPanel />
    </AppShell>
  );
}
