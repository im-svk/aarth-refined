import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/aarth/login-screen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Aarth Educator" },
      {
        name: "description",
        content:
          "Sign in to Aarth Educator, the AI teaching workspace for Indian schools and colleges.",
      },
      { property: "og:title", content: "Sign in — Aarth Educator" },
      {
        property: "og:description",
        content: "Sign in to your institution's Aarth Educator workspace.",
      },
    ],
  }),
  component: LoginScreen,
});
