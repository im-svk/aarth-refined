import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { DayTimeline } from "@/components/aarth/day-timeline";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Card,
  EmptyState,
  IconButton,
  ListRow,
  PageHeader,
  Pill,
  SectionHeader,
} from "@/components/aarth/primitives";
import { calendarEvents, className, todaySchedule } from "@/data/mock";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Aarth Educator" },
      {
        name: "description",
        content: "A month view of tests and assignment due dates alongside today's timetable.",
      },
      { property: "og:title", content: "Calendar — Aarth Educator" },
      { property: "og:description", content: "Tests, due dates and today's timetable." },
    ],
  }),
  component: TeacherCalendar,
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function TeacherCalendar() {
  const [month, setMonth] = useState(8); // September 2026
  const year = 2026;
  const today = 5;

  const grid = useMemo(() => {
    const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const lead = (first + 6) % 7;
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, index) => index + 1),
    ];
  }, [month, year]);

  const isCurrentMonth = month === 8;
  const monthEvents = isCurrentMonth ? calendarEvents : [];
  const [selected, setSelected] = useState<number | null>(today);
  const dayEvents = monthEvents.filter((event) => event.day === selected);

  return (
    <AppShell title="Calendar" wide>
      <div className="space-y-6">
        <PageHeader
          kicker="Teach"
          title="Calendar"
          subtitle="Tests and assignment due dates across your classes, in IST."
          actions={<Pill tone="outline">Academic year 2026–27</Pill>}
        />

        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="display text-xl text-foreground">
                {MONTHS[month]} {year}
              </h2>
              <div className="flex items-center gap-2">
                <IconButton
                  label="Previous month"
                  onClick={() => setMonth((prev) => (prev + 11) % 12)}
                >
                  <ChevronLeft className="size-4" />
                </IconButton>
                <IconButton label="Next month" onClick={() => setMonth((prev) => (prev + 1) % 12)}>
                  <ChevronRight className="size-4" />
                </IconButton>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="pb-2 eyebrow text-muted-foreground"
                >
                  {day.slice(0, 1)}
                </span>
              ))}
              {grid.map((day, index) => {
                if (day === null) return <span key={`pad-${index}`} />;
                const events = monthEvents.filter((event) => event.day === day);
                const isToday = isCurrentMonth && day === today;
                const isSelected = selected === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelected(day)}
                    className={`press flex aspect-square flex-col items-center justify-center rounded-xl border text-xs transition-colors ${
                      isSelected
                        ? "border-primary/40 bg-tint text-tint-foreground"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <span
                      className={
                        isToday ? "font-bold text-primary" : "font-semibold text-foreground"
                      }
                    >
                      {day}
                    </span>
                    {events.length > 0 && (
                      <span className="mt-1 flex gap-0.5">
                        {events.slice(0, 3).map((event) => (
                          <span
                            key={event.id}
                            className={`size-1 rounded-full ${
                              event.kind === "test" ? "bg-primary" : "bg-muted-foreground"
                            }`}
                          />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" /> Test
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground" /> Assignment due
              </span>
            </div>
          </Card>

          <div className="space-y-6">
            <div>
              <SectionHeader
                title={selected ? `${selected} ${MONTHS[month]}` : "Select a day"}
                hint={`${dayEvents.length} scheduled`}
              />
              <Card className="mt-3">
                {dayEvents.length === 0 ? (
                  <EmptyState
                    icon={<CalendarDays className="size-5" />}
                    title="Nothing scheduled"
                    description="No tests or assignment due dates fall on this day."
                  />
                ) : (
                  <div className="divide-y divide-border">
                    {dayEvents.map((event) => (
                      <ListRow
                        key={event.id}
                        icon={<CalendarDays className="size-4" />}
                        title={event.title}
                        subtitle={className(event.classId)}
                        showChevron={false}
                        trailing={
                          <Pill tone={event.kind === "test" ? "tint" : "outline"}>
                            {event.kind === "test" ? "Test" : "Due"}
                          </Pill>
                        }
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div>
              <SectionHeader title="Today's timetable" hint="IST" />
              <Card className="mt-3">
                <DayTimeline items={todaySchedule} nowMinutes={575} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
