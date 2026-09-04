import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./primitives";

/**
 * Dialog on desktop, drag-handle bottom sheet on phone.
 * Same markup, one behaviour, so every modal in the app feels identical.
 */
export function ResponsiveDialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string | undefined;
  footer?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "max-h-[92vh] w-full overflow-hidden rounded-t-3xl border border-border bg-card shadow-[var(--shadow-raised)] sm:rounded-2xl",
          size === "md" ? "sm:max-w-lg" : "sm:max-w-3xl",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-start gap-3 px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="display text-xl text-foreground">{title}</h2>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-2">
            <X className="size-4" />
          </IconButton>
        </div>
        <div className="max-h-[64vh] overflow-y-auto border-t border-border px-5 py-4">
          {children}
        </div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
