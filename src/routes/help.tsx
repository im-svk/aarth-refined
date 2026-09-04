import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & support — Aarth Educator" },
      { name: "description", content: "Help & support in Aarth Educator." },
      { property: "og:title", content: "Help & support — Aarth Educator" },
      { property: "og:description", content: "Help & support in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Help & support">
      <PageHeader kicker="Aarth" title="Help & support" />
      <LoadingPanel />
    </AppShell>
  );
}
