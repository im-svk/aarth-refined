import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { className as classLabel, type ScheduleItem } from "@/data/mock";

/**
 * Google-Calendar "schedule view": a simple stacked agenda, one period below
 * the other. Each period carries a soft colour band derived from its class so
 * the day is scannable at a glance. Colours come from the --ev-* tokens.
 */

const PALETTE = [
  { bar: "bg-ev-1", surface: "bg-ev-1-bg", text: "text-ev-1" },
  { bar: "bg-ev-2", surface: "bg-ev-2-bg", text: "text-ev-2" },
  { bar: "bg-ev-3", surface: "bg-ev-3-bg", text: "text-ev-3" },
  { bar: "bg-ev-4", surface: "bg-ev-4-bg", text: "text-ev-4" },
  { bar: "bg-ev-5", surface: "bg-ev-5-bg", text: "text-ev-5" },
] as const;

function hue(classId: string) {
  let sum = 0;
  for (const ch of classId) sum += ch.charCodeAt(0);
  return PALETTE[sum % PALETTE.length]!;
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function endLabel(time: string, minutes: number) {
  const total = toMinutes(time) + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function DayTimeline({
  items,
  nowMinutes,
  className,
}: {
  items: ScheduleItem[];
  /** Minutes since midnight, used to mark the period in progress. */
  nowMinutes?: number | undefined;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => {
        const tone = hue(item.classId);
        const start = toMinutes(item.time);
        const isNow =
          nowMinutes !== undefined && nowMinutes >= start && nowMinutes < start + item.minutes;
        const isPast = nowMinutes !== undefined && nowMinutes >= start + item.minutes;

        return (
          <li key={item.id}>
            <Link
              to="/classes/$classId"
              params={{ classId: item.classId }}
              className={cn(
                "press flex items-stretch gap-3 rounded-2xl border border-border p-2 transition-colors hover:bg-muted/60",
                isNow ? tone.surface : "bg-card",
                isPast && "opacity-60",
              )}
            >
              <div className="numeric flex w-14 shrink-0 flex-col justify-center py-1 pl-1 text-right">
                <span className="text-[13px] font-semibold leading-tight text-foreground">
                  {item.time}
                </span>
                <span className="text-[11px] leading-tight text-muted-foreground">
                  {endLabel(item.time, item.minutes)}
                </span>
              </div>

              <span className={cn("w-1 shrink-0 rounded-full", tone.bar)} aria-hidden />

              <div className="min-w-0 flex-1 py-1">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="min-w-0 flex-1 text-[15px] font-semibold leading-tight text-foreground">
                    {item.title}
                  </p>
                  {isNow && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        tone.surface,
                        tone.text,
                      )}
                    >
                      Now
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {classLabel(item.classId)} · {item.room} · {item.minutes} min
                </p>
              </div>

              <ChevronRight className="my-auto size-4 shrink-0 text-muted-foreground/60" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
