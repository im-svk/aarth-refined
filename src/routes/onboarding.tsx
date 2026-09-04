import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up institution — Aarth Educator" },
      { name: "description", content: "Set up institution in Aarth Educator." },
      { property: "og:title", content: "Set up institution — Aarth Educator" },
      { property: "og:description", content: "Set up institution in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Set up institution">
      <PageHeader kicker="Aarth" title="Set up institution" />
      <LoadingPanel />
    </AppShell>
  );
}
