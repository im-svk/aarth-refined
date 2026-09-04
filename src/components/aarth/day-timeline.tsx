import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { className as classLabel, type ScheduleItem } from "@/data/mock";

/**
 * Google Calendar-inspired agenda: time stays in a quiet gutter while each
 * class sits on a pale, colour-coded event surface.
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
    <ul className={cn("flex flex-col", className)}>
      {items.map((item) => {
        const tone = hue(item.id);
        const start = toMinutes(item.time);
        const isNow =
          nowMinutes !== undefined && nowMinutes >= start && nowMinutes < start + item.minutes;
        const isPast = nowMinutes !== undefined && nowMinutes >= start + item.minutes;

        return (
          <li
            key={item.id}
            className="group grid grid-cols-[2.75rem_0.875rem_minmax(0,1fr)] gap-x-1.5 pb-2 last:pb-0"
          >
            <div className="numeric flex min-w-0 flex-col items-end pt-2.5 text-right">
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-semibold leading-none",
                  isNow ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.time}
              </span>
              <span className="mt-1 text-[9px] leading-none text-muted-foreground">
                {endLabel(item.time, item.minutes)}
              </span>
            </div>
            <div className="relative flex justify-center" aria-hidden>
              <span className="absolute bottom-[-0.5rem] top-0 w-px bg-border group-first:top-3.5 group-last:bottom-auto group-last:h-3.5" />
              <span
                className={cn(
                  "relative z-10 mt-3 size-2 rounded-full border-2 border-card",
                  isNow ? "bg-primary ring-[3px] ring-primary/15" : "bg-muted-foreground/35",
                )}
              />
            </div>
            <Link
              to="/classes/$classId"
              params={{ classId: item.classId }}
              className={cn(
                "press relative flex min-h-[3.5rem] min-w-0 items-center gap-2 overflow-hidden rounded-[5px] border border-border/60 px-3 py-2 transition-[filter,box-shadow,border-color] hover:brightness-[0.98]",
                tone.surface,
                !isNow && "opacity-75",
                isPast && "opacity-55",
                isNow && "border-primary/30 shadow-sm",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start gap-2">
                  <p className={cn("min-w-0 flex-1 text-[13px] font-semibold leading-tight", tone.text)}>
                    {item.title}
                  </p>
                  {isNow && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full bg-card/80 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide",
                        tone.text,
                      )}
                    >
                      NOW
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-[10px] text-foreground/65">
                  {classLabel(item.classId)} · {item.room}
                </p>
              </div>

              <ChevronRight className={cn("size-4 shrink-0 opacity-50", tone.text)} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
