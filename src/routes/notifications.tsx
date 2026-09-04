import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  Pill,
  SegmentedToggle,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { useApp } from "@/lib/app-context";
import { classes, formatDateTime, notifications, relativeTime } from "@/data/mock";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Aarth Educator" },
      {
        name: "description",
        content: "Institution announcements and reminders, with admin broadcast composing.",
      },
      { property: "og:title", content: "Notifications — Aarth Educator" },
      { property: "og:description", content: "Announcements and reminders for faculty." },
    ],
  }),
  component: Notifications,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

function Notifications() {
  const { isAdmin } = useApp();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [compose, setCompose] = useState(false);
  const [read, setRead] = useState<string[]>(
    notifications.filter((item) => item.read).map((item) => item.id),
  );

  const list = useMemo(
    () => notifications.filter((item) => tab === "all" || !read.includes(item.id)),
    [tab, read],
  );
  const unread = notifications.filter((item) => !read.includes(item.id)).length;

  return (
    <AppShell title="Notifications">
      <div className="space-y-6">
        <PageHeader
          kicker="Workspace"
          title="Notifications"
          subtitle={
            unread > 0
              ? `${unread} unread announcement${unread === 1 ? "" : "s"} from your institution.`
              : "You're all caught up."
          }
          actions={
            isAdmin ? (
              <Button onClick={() => setCompose(true)}>
                <Plus className="size-4" /> New announcement
              </Button>
            ) : undefined
          }
        />

        <div className="flex flex-wrap items-center gap-3">
          <SegmentedToggle
            value={tab}
            onChange={setTab}
            options={[
              { value: "all", label: "All" },
              { value: "unread", label: `Unread${unread ? ` · ${unread}` : ""}` },
            ]}
          />
          {unread > 0 && (
            <Button
              variant="ghost"
              className="sm:ml-auto"
              onClick={() => {
                setRead(notifications.map((item) => item.id));
                toast.success("All marked as read");
              }}
            >
              <CheckCheck className="size-4" /> Mark all read
            </Button>
          )}
        </div>

        {list.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Bell className="size-5" />}
              title="Nothing unread"
              description="New announcements from your institution will appear here."
              action={
                <Button variant="outline" onClick={() => setTab("all")}>
                  View all
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {list.map((item) => {
              const isRead = read.includes(item.id);
              return (
                <Card key={item.id} accent={!isRead} className="p-5 pl-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.priority !== "normal" && (
                      <Pill tone={item.priority === "urgent" ? "tint" : "outline"}>
                        {item.priority === "urgent" ? "Urgent" : "Important"}
                      </Pill>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {relativeTime(item.sentAt)}
                    </span>
                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => setRead((prev) => [...prev, item.id])}
                        className="ml-auto text-[11px] font-semibold text-primary"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <h3 className="display mt-2.5 text-lg text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.message}
                  </p>
                  <p className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
                    Sent {formatDateTime(item.sentAt)} IST
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ResponsiveDialog
        open={compose}
        onClose={() => setCompose(false)}
        title="New announcement"
        description="Sent to the audience you pick, in-app and by email."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCompose(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setCompose(false);
                toast.success("Announcement sent");
              }}
            >
              Send
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Title</span>
          <input placeholder="Term 1 marks entry closes Friday" className={inputClass} />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Audience</span>
            <select className={inputClass}>
              <option>All faculty</option>
              <option>All students</option>
              {classes
                .filter((klass) => !klass.archived)
                .map((klass) => (
                  <option key={klass.id}>{klass.name}</option>
                ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Priority</span>
            <select className={inputClass}>
              <option>Normal</option>
              <option>Important</option>
              <option>Urgent</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Message</span>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary/50"
          />
        </label>
      </ResponsiveDialog>
    </AppShell>
  );
}
