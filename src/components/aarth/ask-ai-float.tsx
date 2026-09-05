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
        d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-2.5l-3.5 3.5V17H8a4 4 0 0 1-4-4V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5 13.5 10H17l-2.75 2 .75 3.25L12 12.75 8.5 15.25l.75-3.25L6.5 10h3.5L12 6.5Z"
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
