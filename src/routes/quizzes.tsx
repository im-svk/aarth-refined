import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title: "Quizzes — Aarth Educator" },
      { name: "description", content: "Quizzes in Aarth Educator." },
      { property: "og:title", content: "Quizzes — Aarth Educator" },
      { property: "og:description", content: "Quizzes in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Quizzes">
      <PageHeader kicker="Aarth" title="Quizzes" />
      <LoadingPanel />
    </AppShell>
  );
}
