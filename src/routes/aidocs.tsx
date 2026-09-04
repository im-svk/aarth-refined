import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/aidocs")({
  head: () => ({
    meta: [
      { title: "Study Material — Aarth Educator" },
      { name: "description", content: "Study Material in Aarth Educator." },
      { property: "og:title", content: "Study Material — Aarth Educator" },
      { property: "og:description", content: "Study Material in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Study Material">
      <PageHeader kicker="Aarth" title="Study Material" />
      <LoadingPanel />
    </AppShell>
  );
}
