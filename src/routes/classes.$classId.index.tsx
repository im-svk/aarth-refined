import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/classes/$classId")({
  head: () => ({
    meta: [
      { title: "Class workspace — Aarth Educator" },
      { name: "description", content: "Class workspace in Aarth Educator." },
      { property: "og:title", content: "Class workspace — Aarth Educator" },
      { property: "og:description", content: "Class workspace in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Class workspace">
      <PageHeader kicker="Aarth" title="Class workspace" />
      <LoadingPanel />
    </AppShell>
  );
}
