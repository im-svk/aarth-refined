import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/aarth/login-screen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teacher code login — Aarth Notes AI" },
      {
        name: "description",
        content:
          "Sign in to Aarth Notes AI with a university teacher code to create notes and study material.",
      },
      { property: "og:title", content: "Teacher code login — Aarth Notes AI" },
      {
        property: "og:description",
        content: "A simple teacher workspace for notes, AI study material, and student class-code sharing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreen,
});
