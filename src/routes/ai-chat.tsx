import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/aarth/app-shell";
import { AskAiIcon } from "@/components/aarth/ask-ai-float";
import { askAi } from "@/lib/ai-chat.functions";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
    ],
  }),
  component: AiChat,
});

function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "submitted" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async ({ text }: { text: string; files: unknown[] }) => {
    const trimmed = text.trim();
    if (!trimmed) return;

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
      const history = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
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

  return (
    <AppShell title="Ask AI" back>
      <div className="flex h-[calc(100dvh-8rem)] flex-col md:h-[calc(100dvh-4rem)]">
        <Conversation className="min-h-0 flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Ask Aarth AI"
                description="Get help with lesson plans, quizzes, notes, or any classroom question."
                icon={<AskAiIcon className="size-8" />}
              />
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

        <div className="mt-4 shrink-0">
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card"
          >
            <PromptInputTextarea placeholder="Ask anything about teaching..." />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={status === "submitted" ? "submitted" : "idle"}
              disabled={status === "submitted"}
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              tooltip="Send message"
              aria-label="Send message"
              type="submit"
                size="icon-sm"
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </AppShell>
  );
}
