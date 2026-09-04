import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { className as classLabel, type ScheduleItem } from "@/data/mock";

/**
 * Google-Calendar style single-day timeline.
 * Hour gutter on the left, hairline hour rules, events absolutely
 * positioned by start time and duration. Tokens only — no category colours.
 */

const HOUR_HEIGHT = 68; // px per hour
const START_HOUR = 8;
const END_HOUR = 17;

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function label(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${suffix}`;
}

export function DayTimeline({
  items,
  nowMinutes,
  className,
}: {
  items: ScheduleItem[];
  /** Minutes since midnight for the "now" line; omit to hide it. */
  nowMinutes?: number | undefined;
  className?: string;
}) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const height = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
  const top = (mins: number) => ((mins - START_HOUR * 60) / 60) * HOUR_HEIGHT;

  return (
    <div className={cn("relative", className)} style={{ height }}>
      {/* Hour rules + gutter */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="absolute inset-x-0 flex items-start gap-3"
          style={{ top: top(hour * 60) }}
        >
          <span className="numeric w-12 shrink-0 -translate-y-1.5 text-right text-[11px] font-medium text-muted-foreground/70">
            {label(hour)}
          </span>
          <span className="mt-0 h-px flex-1 bg-border" />
        </div>
      ))}

      {/* Events */}
      <div className="absolute inset-y-0 left-[60px] right-0">
        {items.map((item) => {
          const start = toMinutes(item.time);
          const blockHeight = Math.max(44, (item.minutes / 60) * HOUR_HEIGHT - 4);
          const isNow =
            nowMinutes !== undefined &&
            nowMinutes >= start &&
            nowMinutes < start + item.minutes;
          return (
            <Link
              key={item.id}
              to="/classes/$classId"
              params={{ classId: item.classId }}
              className="press absolute inset-x-0 block"
              style={{ top: top(start), height: blockHeight }}
            >
              <div
                className={cn(
                  "flex h-full flex-col justify-center overflow-hidden rounded-lg border-l-[3px] px-3 py-1.5",
                  isNow
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/60 bg-tint text-tint-foreground",
                )}
              >
                <p className="truncate text-[13px] font-semibold leading-tight">{item.title}</p>
                <p
                  className={cn(
                    "truncate text-[11px] leading-tight",
                    isNow ? "text-primary-foreground/75" : "text-tint-foreground/70",
                  )}
                >
                  {item.time} · {classLabel(item.classId)} · {item.room}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Now indicator */}
      {nowMinutes !== undefined &&
        nowMinutes >= START_HOUR * 60 &&
        nowMinutes <= END_HOUR * 60 && (
          <div
            className="pointer-events-none absolute inset-x-0 flex items-center gap-1.5"
            style={{ top: top(nowMinutes) }}
          >
            <span className="numeric w-12 shrink-0 text-right text-[10px] font-bold text-destructive">
              now
            </span>
            <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
            <span className="h-px flex-1 bg-destructive/70" />
          </div>
        )}
    </div>
  );
}
