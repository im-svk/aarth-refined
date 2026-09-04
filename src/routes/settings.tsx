import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Aarth Educator" },
      { name: "description", content: "Settings in Aarth Educator." },
      { property: "og:title", content: "Settings — Aarth Educator" },
      { property: "og:description", content: "Settings in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Settings">
      <PageHeader kicker="Aarth" title="Settings" />
      <LoadingPanel />
    </AppShell>
  );
}
