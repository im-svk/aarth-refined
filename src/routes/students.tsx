import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — Aarth Educator" },
      { name: "description", content: "Students in Aarth Educator." },
      { property: "og:title", content: "Students — Aarth Educator" },
      { property: "og:description", content: "Students in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Students">
      <PageHeader kicker="Aarth" title="Students" />
      <LoadingPanel />
    </AppShell>
  );
}
