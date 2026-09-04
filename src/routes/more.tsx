import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "More — Aarth Educator" },
      { name: "description", content: "More in Aarth Educator." },
      { property: "og:title", content: "More — Aarth Educator" },
      { property: "og:description", content: "More in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="More">
      <PageHeader kicker="Aarth" title="More" />
      <LoadingPanel />
    </AppShell>
  );
}
