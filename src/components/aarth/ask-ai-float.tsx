import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function AskAiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-2l-3 3v-3H8a4 4 0 0 1-4-4V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5 13.25 10.5 16.5 11 14 13.25 14.5 16.5 12 15 9.5 16.5 10 13.25 7.5 11 10.75 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AskAiFloatButton({ className }: { className?: string }) {
  return (
    <Link
      to="/ai-chat"
      aria-label="Ask AI"
      className={cn(
        "press fixed right-4 bottom-20 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-raised)] transition-transform hover:opacity-90 md:bottom-8",
        className,
      )}
    >
      <AskAiIcon className="size-5" />
      <span>Ask AI</span>
    </Link>
  );
}
