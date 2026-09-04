import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Aarth Educator" },
      { name: "description", content: "Notes in Aarth Educator." },
      { property: "og:title", content: "Notes — Aarth Educator" },
      { property: "og:description", content: "Notes in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Notes">
      <PageHeader kicker="Aarth" title="Notes" />
      <LoadingPanel />
    </AppShell>
  );
}
