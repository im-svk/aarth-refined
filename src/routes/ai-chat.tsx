import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, SquarePen } from "lucide-react";

import { AskAiIcon } from "@/components/aarth/ask-ai-float";
import { askAi } from "@/lib/ai-chat.functions";
import type { ChatStatus } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  Shimmer,
} from "@/components/ai-elements";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Make a lesson plan for Class 9 Physics",
  "Write 5 MCQs on photosynthesis",
  "Explain trigonometry simply for students",
  "Draft a parent notice for the annual test",
];

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "Ask AI — Aarth Educator" },
      {
        name: "description",
        content:
          "Ask Aarth AI anything about lesson plans, quizzes, notes, or classroom questions.",
      },
      { property: "og:title", content: "Ask AI — Aarth Educator" },
      {
        property: "og:description",
        content: "Ask Aarth AI anything about lesson plans, quizzes, notes, or classroom questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AiChat,
});

function AiChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "submitted" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const send = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || status === "submitted") return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setStatus("submitted");
    setError(null);

    try {
      const history = nextMessages.map((m) => ({ role: m.role, content: m.content }));
      const { content } = await askAi({ data: { messages: history } });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content },
      ]);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const handleSubmit = ({ text }: { text: string; files: unknown[] }) => {
    void send(text);
  };

  const empty = messages.length === 0;

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Go back"
          className="press inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <AskAiIcon className="size-4" />
          </span>
          <span className="truncate text-[15px] font-semibold text-foreground">Aarth AI</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setMessages([]);
            setStatus("idle");
            setError(null);
          }}
          aria-label="New chat"
          className="press inline-flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
        >
          <SquarePen className="size-[18px]" />
        </button>
      </header>

      {/* Transcript */}
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6">
          {empty ? (
            <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
                <AskAiIcon className="size-7" />
              </span>
              <h1 className="display mt-4 text-xl text-foreground">How can I help you teach?</h1>
              <p className="mt-1.5 max-w-xs text-[13px] leading-snug text-muted-foreground">
                Lesson plans, quizzes, notes, notices — just ask.
              </p>
              <div className="mt-6 grid w-full max-w-md gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="press w-full rounded-xl border border-border bg-card px-4 py-3 text-left text-[13px] text-foreground shadow-[var(--shadow-card)] hover:bg-muted/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.role === "assistant" ? (
                    <MessageResponse>{message.content}</MessageResponse>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </MessageContent>
              </Message>
            ))
          )}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer as="span" className="text-sm">
                  Thinking...
                </Shimmer>
              </MessageContent>
            </Message>
          )}

          {status === "error" && (
            <Message from="assistant">
              <MessageContent>
                <p className="text-sm text-destructive">{error}</p>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Composer */}
      <div className="shrink-0 border-t border-border/70 bg-background/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]"
          >
            <PromptInputTextarea placeholder="Ask anything about teaching..." />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={(status === "submitted" ? "submitted" : "idle") as ChatStatus}
                disabled={status === "submitted"}
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Send message"
                type="submit"
                size="icon-sm"
              />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Aarth AI can make mistakes. Check important details.
          </p>
        </div>
      </div>
    </div>
  );
}
