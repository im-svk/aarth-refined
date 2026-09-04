import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/join/$token")({
  head: () => ({
    meta: [
      { title: "Join class — Aarth Educator" },
      { name: "description", content: "Join class in Aarth Educator." },
      { property: "og:title", content: "Join class — Aarth Educator" },
      { property: "og:description", content: "Join class in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Join class">
      <PageHeader kicker="Aarth" title="Join class" />
      <LoadingPanel />
    </AppShell>
  );
}
