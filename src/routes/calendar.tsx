import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Aarth Educator" },
      { name: "description", content: "Calendar in Aarth Educator." },
      { property: "og:title", content: "Calendar — Aarth Educator" },
      { property: "og:description", content: "Calendar in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Calendar">
      <PageHeader kicker="Aarth" title="Calendar" />
      <LoadingPanel />
    </AppShell>
  );
}
