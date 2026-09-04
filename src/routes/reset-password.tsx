import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Aarth Educator" },
      { name: "description", content: "Reset password in Aarth Educator." },
      { property: "og:title", content: "Reset password — Aarth Educator" },
      { property: "og:description", content: "Reset password in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Reset password">
      <PageHeader kicker="Aarth" title="Reset password" />
      <LoadingPanel />
    </AppShell>
  );
}
