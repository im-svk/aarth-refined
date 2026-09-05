import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Overlay detail surface: bottom sheet on phone, right-anchored slide-over on desktop.
 */
export function SideSheet({
  open,
  onClose,
  label,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-stretch sm:justify-end"
      style={{ animation: "fade-in 160ms var(--ease-ui)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-[var(--shadow-raised)]",
          "sm:h-full sm:max-h-none sm:w-[26rem] sm:rounded-none sm:rounded-l-3xl sm:border-y-0 sm:border-r-0",
        )}
        style={{
          animation: "sheet-up 220ms var(--ease-ui)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="relative shrink-0">
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border sm:hidden" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="press absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-muted/70 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border bg-card px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
