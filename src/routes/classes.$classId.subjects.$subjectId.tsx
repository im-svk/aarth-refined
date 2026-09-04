import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/classes/$classId/subjects/$subjectId")({
  head: () => ({
    meta: [
      { title: "Subject workspace — Aarth Educator" },
      { name: "description", content: "Subject workspace in Aarth Educator." },
      { property: "og:title", content: "Subject workspace — Aarth Educator" },
      { property: "og:description", content: "Subject workspace in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Subject workspace">
      <PageHeader kicker="Aarth" title="Subject workspace" />
      <LoadingPanel />
    </AppShell>
  );
}
