import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aarth/app-shell";
import { PageHeader, LoadingPanel } from "@/components/aarth/primitives";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Aarth Educator" },
      { name: "description", content: "Sign in in Aarth Educator." },
      { property: "og:title", content: "Sign in — Aarth Educator" },
      { property: "og:description", content: "Sign in in Aarth Educator." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell title="Sign in">
      <PageHeader kicker="Aarth" title="Sign in" />
      <LoadingPanel />
    </AppShell>
  );
}
