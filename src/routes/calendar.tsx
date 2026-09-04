import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  BellRing,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  ListChecks,
  Megaphone,
  Plus,
  Trash2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calendarEvents, className, todaySchedule } from "@/data/mock";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "My calendar — Aarth Educator" },
      {
        name: "description",
        content:
          "Your teaching calendar: timetable, tests and assignment due dates, key school dates, announcements and your own activities.",
      },
      { property: "og:title", content: "My calendar — Aarth Educator" },
      {
        property: "og:description",
        content: "Timetable, tests, due dates, key dates, announcements and activities in one place.",
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

/** Today in IST for this workspace: Friday, 4 September 2026. */
const TODAY = { year: 2026, month: 8, day: 4 };

const ACTIVITY_TYPES = ["To-do", "Reminder", "Test", "Announcement"] as const;
type ActivityType = (typeof ACTIVITY_TYPES)[number];

type Activity = {
  id: string;
  date: string; // YYYY-MM-DD
  type: ActivityType;
  title: string;
  time?: string;
  note?: string;
};

const STORAGE_KEY = "aarth.calendar.activities";

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

const pad = (value: number) => String(value).padStart(2, "0");
const isoDate = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

const formatIsoLabel = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const typeIcon = (type: ActivityType) => {
  if (type === "Test") return <GraduationCap className="size-4" />;
  if (type === "Reminder") return <BellRing className="size-4" />;
  if (type === "Announcement") return <Megaphone className="size-4" />;
  return <ListChecks className="size-4" />;
};

function TeacherCalendar() {
  const [cursor, setCursor] = useState({ month: TODAY.month, year: TODAY.year });
  const { month, year } = cursor;
  const [view, setView] = useState<"day" | "month">("month");
  const [selected, setSelected] = useState<number>(TODAY.day);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<{
    type: ActivityType;
    title: string;
    date: string;
    time: string;
    note: string;
  }>({
    type: "To-do",
    title: "",
    date: isoDate(TODAY.year, TODAY.month, TODAY.day),
    time: "",
    note: "",
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setActivities(JSON.parse(raw) as Activity[]);
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  const persist = (next: Activity[]) => {
    setActivities(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const grid = useMemo(() => {
    const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const lead = (first + 6) % 7;
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, index) => index + 1),
    ];
  }, [month, year]);

  const isCurrentMonth = month === TODAY.month && year === TODAY.year;
  const monthEvents = isCurrentMonth ? calendarEvents : [];
  const dayEvents = monthEvents.filter((event) => event.day === selected);
  const selectedIso = isoDate(year, month, selected);
  const dayActivities = activities.filter((item) => item.date === selectedIso);
  const activitiesByDay = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of activities) {
      const [y, m, d] = item.date.split("-").map(Number);
      if (y === year && (m ?? 0) - 1 === month && d) map.set(d, (map.get(d) ?? 0) + 1);
    }
    return map;
  }, [activities, month, year]);
  const showTimetable = isCurrentMonth && selected === TODAY.day;

  const weekStrip = useMemo(() => {
    const start = (isCurrentMonth ? TODAY.day : 1) - (isCurrentMonth ? 2 : 0);
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Array.from({ length: 7 }, (_, index) => {
      const day = start + index;
      const date = new Date(Date.UTC(year, month, day));
      return { day, weekday: WEEKDAYS[(date.getUTCDay() + 6) % 7]! };
    }).filter((entry) => entry.day >= 1 && entry.day <= daysInMonth);
  }, [month, year, isCurrentMonth]);

  const shiftMonth = (delta: number) =>
    setCursor((prev) => {
      const next = prev.month + delta;
      if (next < 0) return { month: 11, year: prev.year - 1 };
      if (next > 11) return { month: 0, year: prev.year + 1 };
      return { month: next, year: prev.year };
    });

  const openDialog = () => {
    setForm({
      type: "To-do",
      title: "",
      date: selectedIso,
      time: "",
      note: "",
    });
    setDialogOpen(true);
  };

  const saveActivity = () => {
    if (!form.title.trim()) return;
    const activity: Activity = {
      id: `act-${Date.now()}`,
      date: form.date,
      type: form.type,
      title: form.title.trim(),
      ...(form.time ? { time: form.time } : {}),
      ...(form.note.trim() ? { note: form.note.trim() } : {}),
    };
    persist([...activities, activity]);
    const [y, m, d] = form.date.split("-").map(Number);
    if (y && m && d) {
      setCursor({ month: m - 1, year: y });
      setSelected(d);
    }
    setDialogOpen(false);
  };

  const monthNav = (
    <div className="flex items-center gap-1">
      <IconButton label="Previous month" onClick={() => shiftMonth(-1)}>
        <ChevronLeft className="size-4" />
      </IconButton>
      <span className="min-w-[8.5rem] text-center text-sm font-semibold text-foreground">
        {MONTHS[month]} {year}
      </span>
      <IconButton label="Next month" onClick={() => shiftMonth(1)}>
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
        const activityCount = activitiesByDay.get(day) ?? 0;
        const isToday = isCurrentMonth && day === TODAY.day;
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
                  ? "numeric flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground"
                  : "numeric font-semibold text-foreground"
              }
            >
              {day}
            </span>
            {(events.length > 0 || activityCount > 0) && (
              <span className="mt-1 flex gap-0.5">
                {events.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    className={`size-1 rounded-full ${
                      event.kind === "test" ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                ))}
                {activityCount > 0 && <span className="size-1 rounded-full bg-emerald-500" />}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const dayPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-muted-foreground">Selected day</p>
          <h2 className="display text-[17px] leading-tight text-foreground">
            {selected} {MONTHS[month]} {year}
          </h2>
        </div>
        <Button size="sm" variant="outline" onClick={openDialog}>
          <Plus className="size-4" /> Add activity
        </Button>
      </div>

      {showTimetable && (
        <div>
          <SectionHeader title="Classes assigned" hint="IST" />
          <Card className="mt-3 p-3">
            <DayTimeline items={todaySchedule} nowMinutes={575} />
          </Card>
        </div>
      )}

      <div>
        <SectionHeader title="My activities" hint={`${dayActivities.length} saved`} />
        <Card className="mt-3">
          {dayActivities.length === 0 ? (
            <EmptyState
              icon={<ListChecks className="size-5" />}
              title="No activities yet"
              description="Add a to-do, reminder or test for this day."
              action={
                <Button size="sm" variant="outline" onClick={openDialog}>
                  <Plus className="size-4" /> Add activity
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {dayActivities.map((item) => (
                <ListRow
                  key={item.id}
                  icon={typeIcon(item.type)}
                  title={item.title}
                  subtitle={[item.time, item.note].filter(Boolean).join(" · ") || item.type}
                  showChevron={false}
                  trailing={
                    <span className="flex items-center gap-2">
                      <Pill tone={item.type === "Test" ? "tint" : "outline"}>{item.type}</Pill>
                      <IconButton
                        label={`Delete ${item.title}`}
                        className="size-8"
                        onClick={() =>
                          persist(activities.filter((entry) => entry.id !== item.id))
                        }
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </span>
                  }
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <div>
        <SectionHeader title="Tests & due dates" hint={`${dayEvents.length} scheduled`} />
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

  const legend = (
    <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" /> Test
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-muted-foreground" /> Assignment due
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-emerald-500" /> My activity
      </span>
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
              Your timetable, class tests and due dates, school key dates, announcements and your own
              activities — all in IST.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone="outline">2026–27</Pill>
            <Button size="sm" variant="outline" onClick={openDialog}>
              <Plus className="size-4" /> Add activity
            </Button>
          </div>
        </header>

        {/* Mobile: month first, then agenda for the selected day */}
        <div className="md:hidden">
          <div className="flex rounded-xl border border-border p-1">
            {(["month", "day"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`press flex-1 rounded-lg py-2 text-[12px] font-semibold ${
                  view === option ? "bg-tint text-tint-foreground" : "text-muted-foreground"
                }`}
              >
                {option === "month" ? "Month" : "Agenda"}
              </button>
            ))}
          </div>

          {view === "month" ? (
            <div className="mt-3 space-y-4">
              <Card className="p-4">
                <div className="mb-3 flex items-center justify-center">{monthNav}</div>
                {monthGrid}
                <div className="mt-4">{legend}</div>
              </Card>
              {dayPanel}
            </div>
          ) : (
            <>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {weekStrip.map((entry) => {
                  const active = selected === entry.day;
                  const count =
                    monthEvents.filter((event) => event.day === entry.day).length +
                    (activitiesByDay.get(entry.day) ?? 0);
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
            <div className="mt-5">{legend}</div>
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

      {/* Add activity dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-2xl sm:max-w-[27rem] max-sm:bottom-0 max-sm:top-auto max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-[1.75rem] [&>button:last-child]:hidden">
          <div className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-border sm:hidden" />

          <DialogHeader className="px-5 pb-4 pt-4 text-center sm:text-center">
            <DialogTitle className="display text-[17px] leading-tight text-foreground">
              New activity
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              Saved to {form.date ? formatIsoLabel(form.date) : "the selected day"}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] space-y-5 overflow-y-auto border-t border-border bg-muted/30 px-5 py-5">
            {/* Type segmented control */}
            <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted p-1">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type }))}
                  className={`press flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-semibold transition-colors ${
                    form.type === type
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {typeIcon(type)}
                  <span className="w-full truncate px-0.5 text-[10px] leading-none">
                    {type === "Announcement" ? "Notice" : type}
                  </span>
                </button>
              ))}
            </div>

            {/* Grouped fields */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="px-4 py-3">
                <label
                  htmlFor="activity-title"
                  className="mb-1 block text-[11px] font-semibold text-muted-foreground"
                >
                  Title
                </label>
                <input
                  id="activity-title"
                  placeholder="e.g. Grade Class 10 physics test"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-[15px] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/70"
                />
              </div>

              <div className="grid grid-cols-2 border-t border-border">
                <div className="border-r border-border px-4 py-3">
                  <label
                    htmlFor="activity-date"
                    className="mb-1 block text-[11px] font-semibold text-muted-foreground"
                  >
                    Date
                  </label>
                  <input
                    id="activity-date"
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                    className="numeric w-full border-0 bg-transparent p-0 text-[14px] font-medium text-foreground outline-none"
                  />
                </div>
                <div className="px-4 py-3">
                  <label
                    htmlFor="activity-time"
                    className="mb-1 block text-[11px] font-semibold text-muted-foreground"
                  >
                    Time · optional
                  </label>
                  <input
                    id="activity-time"
                    type="time"
                    value={form.time}
                    onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                    className="numeric w-full border-0 bg-transparent p-0 text-[14px] font-medium text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-border px-4 py-3">
                <label
                  htmlFor="activity-note"
                  className="mb-1 block text-[11px] font-semibold text-muted-foreground"
                >
                  Note · optional
                </label>
                <input
                  id="activity-note"
                  placeholder="Add a short detail"
                  value={form.note}
                  onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                  className="w-full border-0 bg-transparent p-0 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border px-5 py-4 max-sm:pb-6 sm:justify-end sm:space-x-0">
            <Button
              variant="outline"
              className="max-sm:w-full"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="max-sm:w-full"
              onClick={saveActivity}
              disabled={!form.title.trim() || !form.date}
            >
              Save activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AppShell>
  );
}
