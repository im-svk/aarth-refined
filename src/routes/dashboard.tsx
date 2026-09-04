import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — Aarth Educator" },
      { name: "description", content: "Home in Aarth Educator." },
      { property: "og:title", content: "Home — Aarth Educator" },
      { property: "og:description", content: "Home in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Home">
      <PageHeader kicker="Aarth" title="Home" />
      <LoadingPanel />
    </AppShell>
  );
}
