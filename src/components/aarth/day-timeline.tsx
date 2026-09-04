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
        const tone = hue(item.classId);
        const start = toMinutes(item.time);
        const isNow =
          nowMinutes !== undefined && nowMinutes >= start && nowMinutes < start + item.minutes;
        const isPast = nowMinutes !== undefined && nowMinutes >= start + item.minutes;

        return (
          <li key={item.id} className="group relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 pb-3 last:pb-0">
            <div className="numeric relative flex shrink-0 flex-col items-end pt-3 text-right">
              <span className="text-[12px] font-semibold leading-none text-foreground">
                {item.time}
              </span>
              <span className="mt-1 text-[10px] leading-none text-muted-foreground">
                {endLabel(item.time, item.minutes)}
              </span>
              <span
                className="absolute -right-[0.45rem] top-[1.05rem] size-1.5 rounded-full bg-border group-last:hidden"
                aria-hidden
              />
              <span
                className="absolute -bottom-1 -right-[0.275rem] top-[1.35rem] w-px bg-border group-last:hidden"
                aria-hidden
              />
            </div>
            <Link
              to="/classes/$classId"
              params={{ classId: item.classId }}
              className={cn(
                "press relative flex min-h-[4.75rem] min-w-0 items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 transition-[filter] hover:brightness-[0.98]",
                tone.surface,
                isPast && "opacity-55",
              )}
            >
              <span className={cn("absolute inset-y-0 left-0 w-1", tone.bar)} aria-hidden />

              <div className="min-w-0 flex-1 py-1">
                <div className="flex min-w-0 items-start gap-2">
                  <p className={cn("min-w-0 flex-1 text-[14px] font-semibold leading-snug", tone.text)}>
                    {item.title}
                  </p>
                  {isNow && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full bg-card/70 px-2 py-0.5 text-[10px] font-semibold",
                        tone.text,
                      )}
                    >
                      Now
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-[11px] text-foreground/65">
                  {classLabel(item.classId)} · {item.room}
                </p>
              </div>

              <ChevronRight className={cn("size-4 shrink-0 opacity-55", tone.text)} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
