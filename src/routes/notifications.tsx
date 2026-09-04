import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Aarth Educator" },
      { name: "description", content: "Notifications in Aarth Educator." },
      { property: "og:title", content: "Notifications — Aarth Educator" },
      { property: "og:description", content: "Notifications in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Notifications">
      <PageHeader kicker="Aarth" title="Notifications" />
      <LoadingPanel />
    </AppShell>
  );
}
