import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create institution — Aarth Educator" },
      { name: "description", content: "Create institution in Aarth Educator." },
      { property: "og:title", content: "Create institution — Aarth Educator" },
      { property: "og:description", content: "Create institution in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Create institution">
      <PageHeader kicker="Aarth" title="Create institution" />
      <LoadingPanel />
    </AppShell>
  );
}
