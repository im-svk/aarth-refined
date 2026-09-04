import type { ComponentProps, ReactNode } from "react";
import { ChevronRight, Loader2, Lock, Monitor, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/data/mock";

/* ---------------- Page + section headers ---------------- */

export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
  className,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {kicker && <p className="eyebrow text-muted-foreground">{kicker}</p>}
        <h1 className="display-lg mt-2 text-[1.75rem] text-foreground sm:text-[2.35rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}

      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHeader({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-[0.9375rem] font-semibold tracking-[-0.014em] text-foreground">
          {title}
        </h2>

        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Surfaces ---------------- */

export function Card({
  className,
  interactive,
  accent,
  children,
  ...rest
}: ComponentProps<"div"> & { interactive?: boolean; accent?: boolean }) {
  return (
    <div
      className={cn(
        "hairline-card relative overflow-hidden",
        interactive && "press cursor-pointer transition-colors hover:border-primary/35",
        className,
      )}
      {...rest}
    >
      {accent && <span className="absolute inset-y-0 left-0 w-[2px] bg-primary" />}
      {children}
    </div>
  );
}

export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  showChevron,
  interactive,
  className,
  onClick,
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  showChevron?: boolean;
  /** Use when the row is already wrapped in a <Link> — avoids nested buttons. */
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  const tappable = Boolean(onClick) || interactive;
  const chevron = showChevron ?? tappable;
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full min-h-[3.5rem] items-center gap-3 px-4 py-3 text-left transition-colors",
        tappable && "press hover:bg-muted/60",
        className,
      )}
    >
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{subtitle}</span>
        )}
      </span>
      {trailing}
      {chevron && <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
    </Comp>
  );
}


export function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.8125rem] font-medium tracking-[-0.006em] text-muted-foreground">
          {label}
        </p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className="display numeric mt-3 text-[2rem] text-foreground">{value}</p>

      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

/* ---------------- Controls ---------------- */

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md";
}) {
  return (
    <button
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-xl font-semibold disabled:pointer-events-none disabled:opacity-50",
        size === "md" ? "h-11 px-4 text-sm" : "h-9 px-3 text-xs",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-border bg-card text-foreground hover:bg-muted",
        variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground",
        variant === "danger" && "border border-destructive/30 text-destructive hover:bg-destructive/10",
        className,
      )}
      {...rest}
    />
  );
}

export function IconButton({
  className,
  label,
  ...rest
}: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "press inline-flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...rest}
    />
  );
}

export function Pill({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "tint" | "outline" | "success" | "warning" | "danger";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "tint" && "bg-tint text-tint-foreground",
        tone === "outline" && "border border-border text-muted-foreground",
        tone === "success" && "bg-success/10 text-success",
        tone === "warning" && "bg-warning/10 text-warning",
        tone === "danger" && "bg-destructive/10 text-destructive",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "press h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold",
              active
                ? "border-primary/40 bg-tint text-tint-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
            {option.hint && <span className="ml-1 font-medium opacity-70">{option.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center gap-1 rounded-xl border border-border bg-card p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 rounded-lg px-3.5 text-xs font-semibold transition-colors",
              active
                ? "bg-tint text-tint-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- People ---------------- */

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-tint font-semibold text-tint-foreground",
        size === "sm" && "size-8 text-[11px]",
        size === "md" && "size-10 text-xs",
        size === "lg" && "size-16 text-lg",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function PersonRow({
  name,
  meta,
  trailing,
  active,
  onClick,
}: {
  name: string;
  meta?: ReactNode;
  trailing?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press flex w-full min-h-[3.5rem] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        active ? "bg-tint" : "hover:bg-muted/60",
      )}
    >
      <Avatar name={name} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{name}</span>
        {meta && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{meta}</span>}
      </span>
      {trailing}
    </button>
  );
}

/* ---------------- States ---------------- */

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-muted-foreground", className)} />;
}

export function LoadingPanel({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Spinner />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-tint text-tint-foreground">
        {icon}
      </span>
      <h3 className="display mt-4 text-xl text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function PlanGate({
  feature,
  description,
  onPreview,
}: {
  feature: string;
  description: string;
  onPreview?: () => void;
}) {
  return (
    <Card className="mx-auto max-w-xl p-8 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Lock className="size-5" />
      </span>
      <h3 className="display mt-4 text-2xl text-foreground">{feature} isn't on your plan</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button>Talk to Aarth about upgrading</Button>
        {onPreview && (
          <Button variant="outline" onClick={onPreview}>
            Preview it anyway
          </Button>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Institution plan: Essential · Contact your Aarth partner manager to enable this.
      </p>
    </Card>
  );
}

export function DesktopOnlyNotice({ what }: { what: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-3 md:hidden">
      <Monitor className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        The {what} is best on desktop. You can browse and preview here — open Aarth on a laptop to
        edit.
      </p>
    </div>
  );
}
