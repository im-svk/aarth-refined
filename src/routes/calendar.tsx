import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  BellRing,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Plus,
} from "lucide-react";
import { DayTimeline } from "@/components/aarth/day-timeline";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  IconButton,
  ListRow,
  Pill,
  SectionHeader,
} from "@/components/aarth/primitives";
import { calendarEvents, className, todaySchedule } from "@/data/mock";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "My calendar — Aarth Educator" },
      {
        name: "description",
        content:
          "Your teaching calendar: timetable, tests and assignment due dates, key school dates and announcements.",
      },
      { property: "og:title", content: "My calendar — Aarth Educator" },
      {
        property: "og:description",
        content: "Timetable, tests, due dates, key dates and announcements in one place.",
      },
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

const KEY_DATES = [
  { id: "k1", label: "12 Sep", title: "Mid-term exam week begins", note: "Grades 8–12" },
  { id: "k2", label: "19 Sep", title: "Parent–teacher meeting", note: "10:00 IST · Auditorium" },
  { id: "k3", label: "02 Oct", title: "Gandhi Jayanti — school holiday", note: "Institution wide" },
];

const ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "Submit mid-term question papers by Monday",
    from: "Academic office",
    when: "Today · 11:20 IST",
  },
  {
    id: "a2",
    title: "Lab 2 unavailable on Thursday afternoon",
    from: "Facilities",
    when: "Yesterday · 16:05 IST",
  },
];

function TeacherCalendar() {
  const [month, setMonth] = useState(8); // September 2026
  const year = 2026;
  const today = 5;
  const [view, setView] = useState<"day" | "month">("day");

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
  const showTimetable = isCurrentMonth && selected === today;

  const weekStrip = useMemo(() => {
    const start = today - 2;
    return Array.from({ length: 7 }, (_, index) => {
      const day = start + index;
      const date = new Date(Date.UTC(year, month, day));
      return { day, weekday: WEEKDAYS[(date.getUTCDay() + 6) % 7]! };
    }).filter((entry) => entry.day >= 1);
  }, [month, year, today]);

  const monthNav = (
    <div className="flex items-center gap-1">
      <IconButton label="Previous month" onClick={() => setMonth((prev) => (prev + 11) % 12)}>
        <ChevronLeft className="size-4" />
      </IconButton>
      <span className="min-w-[7.5rem] text-center text-sm font-semibold text-foreground">
        {MONTHS[month]} {year}
      </span>
      <IconButton label="Next month" onClick={() => setMonth((prev) => (prev + 1) % 12)}>
        <ChevronRight className="size-4" />
      </IconButton>
    </div>
  );

  const monthGrid = (
    <div className="grid grid-cols-7 gap-1 text-center">
      {WEEKDAYS.map((day) => (
        <span key={day} className="eyebrow pb-2 text-muted-foreground">
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
            className={`press flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition-colors ${
              isSelected
                ? "border-primary/40 bg-tint text-tint-foreground"
                : "border-transparent hover:border-border"
            }`}
          >
            <span
              className={
                isToday
                  ? "numeric font-bold text-primary"
                  : "numeric font-semibold text-foreground"
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
  );

  const dayPanel = (
    <div className="space-y-4">
      {showTimetable && (
        <div>
          <SectionHeader title="Classes assigned" hint="IST" />
          <Card className="mt-3 p-3">
            <DayTimeline items={todaySchedule} nowMinutes={575} />
          </Card>
        </div>
      )}

      <div>
        <SectionHeader
          title="Tests & due dates"
          hint={`${dayEvents.length} on ${selected ?? "—"} ${MONTHS[month]?.slice(0, 3)}`}
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
                  icon={
                    event.kind === "test" ? (
                      <GraduationCap className="size-4" />
                    ) : (
                      <ClipboardList className="size-4" />
                    )
                  }
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
    </div>
  );

  return (
    <AppShell title="My calendar" back wide>
      <div className="space-y-6">
        {/* Subpage hero */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                aria-label="Back to home"
                className="press hidden size-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground md:inline-flex"
              >
                <ChevronLeft className="size-4" />
              </Link>
              <span className="eyebrow text-muted-foreground">Teach</span>
            </div>
            <h1 className="display mt-2 text-[26px] leading-tight text-foreground md:text-3xl">
              My calendar
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">
              Your timetable, class tests and due dates, school key dates and announcements — all in
              IST.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone="outline">2026–27</Pill>
            <Button size="sm" variant="outline">
              <Plus className="size-4" /> Add date
            </Button>
          </div>
        </header>

        {/* Mobile: day / month toggle + week strip */}
        <div className="md:hidden">
          <div className="flex rounded-xl border border-border p-1">
            {(["day", "month"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`press flex-1 rounded-lg py-2 text-[12px] font-semibold capitalize ${
                  view === option
                    ? "bg-tint text-tint-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {option === "day" ? "Agenda" : "Month"}
              </button>
            ))}
          </div>

          {view === "day" ? (
            <>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {weekStrip.map((entry) => {
                  const active = selected === entry.day;
                  const count = monthEvents.filter((event) => event.day === entry.day).length;
                  return (
                    <button
                      key={entry.day}
                      type="button"
                      onClick={() => setSelected(entry.day)}
                      className={`press flex w-12 shrink-0 flex-col items-center gap-1 rounded-xl border py-2 ${
                        active
                          ? "border-primary/40 bg-tint text-tint-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase">{entry.weekday}</span>
                      <span className="numeric text-[15px] font-bold text-foreground">
                        {entry.day}
                      </span>
                      <span
                        className={`size-1 rounded-full ${count > 0 ? "bg-primary" : "bg-transparent"}`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">{dayPanel}</div>
            </>
          ) : (
            <div className="mt-3 space-y-4">
              <Card className="p-4">
                <div className="mb-3 flex items-center justify-center">{monthNav}</div>
                {monthGrid}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-primary" /> Test
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-muted-foreground" /> Assignment due
                  </span>
                </div>
              </Card>
              {dayPanel}
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden gap-5 md:grid lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="display text-lg text-foreground">Month</h2>
              {monthNav}
            </div>
            <div className="mt-5">{monthGrid}</div>
            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" /> Test
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground" /> Assignment due
              </span>
            </div>
          </Card>
          {dayPanel}
        </div>

        {/* Key dates + announcements */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <SectionHeader title="Key dates" hint="This term" />
            <Card className="mt-3 divide-y divide-border">
              {KEY_DATES.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="numeric mt-0.5 shrink-0 rounded-lg bg-muted px-2 py-1 text-[11px] font-semibold text-foreground">
                    {entry.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight text-foreground">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{entry.note}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <SectionHeader
              title="Announcements"
              hint="From your institution"
              action={
                <Link to="/notifications" className="text-[12px] font-semibold text-primary">
                  View all
                </Link>
              }
            />
            <Card className="mt-3 divide-y divide-border">
              {ANNOUNCEMENTS.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-tint text-tint-foreground">
                    {item.id === "a1" ? (
                      <Megaphone className="size-4" />
                    ) : (
                      <BellRing className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {item.from} · {item.when}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
