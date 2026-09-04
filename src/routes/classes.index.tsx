import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Classes — Aarth Educator" },
      { name: "description", content: "Classes in Aarth Educator." },
      { property: "og:title", content: "Classes — Aarth Educator" },
      { property: "og:description", content: "Classes in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Classes">
      <PageHeader kicker="Aarth" title="Classes" />
      <LoadingPanel />
    </AppShell>
  );
}
