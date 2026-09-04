import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/textbooks")({
  head: () => ({
    meta: [
      { title: "Academic Textbooks — Aarth Educator" },
      { name: "description", content: "Academic Textbooks in Aarth Educator." },
      { property: "og:title", content: "Academic Textbooks — Aarth Educator" },
      { property: "og:description", content: "Academic Textbooks in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Academic Textbooks">
      <PageHeader kicker="Aarth" title="Academic Textbooks" />
      <LoadingPanel />
    </AppShell>
  );
}
