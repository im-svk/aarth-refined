import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/aarth/login-screen";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Teacher login — Aarth Notes AI" },
      {
        name: "description",
        content: "Use your university teacher code to open your Aarth Notes AI workspace.",
      },
      { property: "og:title", content: "Teacher login — Aarth Notes AI" },
      {
        property: "og:description",
        content: "Teacher code login for notes, AI study material, and class sharing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreen,
});
