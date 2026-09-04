import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: "Curriculum — Aarth Educator" },
      { name: "description", content: "Curriculum in Aarth Educator." },
      { property: "og:title", content: "Curriculum — Aarth Educator" },
      { property: "og:description", content: "Curriculum in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Curriculum">
      <PageHeader kicker="Aarth" title="Curriculum" />
      <LoadingPanel />
    </AppShell>
  );
}
