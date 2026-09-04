import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/aarth/login-screen";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Educator sign in — Aarth Educator" },
      {
        name: "description",
        content: "Sign in to your Aarth Educator account to manage classes and teaching material.",
      },
      { property: "og:title", content: "Educator sign in — Aarth Educator" },
      {
        property: "og:description",
        content: "Sign in to manage your classes, study material and assessments.",
      },
    ],
  }),
  component: LoginScreen,
});
