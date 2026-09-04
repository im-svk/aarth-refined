import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, LifeBuoy, Mail, MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/aarth/app-shell";
import {
  Button,
  Card,
  EmptyState,
  ListRow,
  PageHeader,
  Pill,
  SectionHeader,
} from "@/components/aarth/primitives";
import { ResponsiveDialog } from "@/components/aarth/responsive-dialog";
import { formatDate, tickets } from "@/data/mock";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Aarth Educator" },
      {
        name: "description",
        content: "Guides, FAQs and support tickets for teachers using Aarth Educator.",
      },
      { property: "og:title", content: "Help & Support — Aarth Educator" },
      { property: "og:description", content: "Guides, FAQs and support tickets." },
    ],
  }),
  component: Help,
});

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50";

const FAQS = [
  {
    q: "How do students join a class?",
    a: "Share the class join link or invite them by email from Students. They confirm with the roll number you assign.",
  },
  {
    q: "Can I edit AI-generated study material?",
    a: "Yes. Every generated document opens in the A4 editor where you can rewrite, restructure and add your own notes before sharing.",
  },
  {
    q: "Which boards are supported?",
    a: "CBSE / NCERT and Karnataka State (KTBS) textbooks for grades 8 to 12, including Class 11 and 12 streams.",
  },
  {
    q: "Why is Analytics locked?",
    a: "Analytics, Assignments and Class Planner are part of a higher institution plan. Your admin can enable them from Settings.",
  },
];

const GUIDES = [
  { title: "Set up your first class", meta: "4 min read" },
  { title: "Generate a chapter study pack", meta: "3 min read" },
  { title: "Build a board-style question paper", meta: "6 min read" },
  { title: "Plan a term with the Class Planner", meta: "5 min read" },
];

function Help() {
  const [open, setOpen] = useState(false);
  const [faq, setFaq] = useState<string | null>(FAQS[0]!.q);

  return (
    <AppShell title="Help">
      <div className="space-y-8">
        <PageHeader
          kicker="More"
          title="Help & support"
          subtitle="Guides for everyday teaching tasks, plus a direct line to the Aarth team."
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> New ticket
            </Button>
          }
        />

        <section className="space-y-3">
          <SectionHeader title="Guides" hint="Short walkthroughs" />
          <Card>
            <div className="divide-y divide-border">
              {GUIDES.map((guide) => (
                <ListRow
                  key={guide.title}
                  icon={<BookOpen className="size-4" />}
                  title={guide.title}
                  subtitle={guide.meta}
                  onClick={() => toast.success("Opening guide")}
                />
              ))}
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Frequently asked" />
          <Card className="divide-y divide-border px-5">
            {FAQS.map((item) => (
              <div key={item.q} className="py-4">
                <button
                  type="button"
                  onClick={() => setFaq(faq === item.q ? null : item.q)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">{item.q}</span>
                  <span className="text-xs text-muted-foreground">{faq === item.q ? "−" : "+"}</span>
                </button>
                {faq === item.q && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Your tickets" hint={`${tickets.length} raised`} />
          <Card>
            {tickets.length === 0 ? (
              <EmptyState
                icon={<LifeBuoy className="size-5" />}
                title="No tickets yet"
                description="Raise a ticket and the Aarth team replies by email within one working day."
                action={<Button onClick={() => setOpen(true)}>New ticket</Button>}
              />
            ) : (
              <div className="divide-y divide-border">
                {tickets.map((ticket) => (
                  <ListRow
                    key={ticket.id}
                    icon={<MessageCircle className="size-4" />}
                    title={ticket.subject}
                    subtitle={`${ticket.type} · ${ticket.priority} priority · ${formatDate(ticket.createdAt)}`}
                    showChevron={false}
                    trailing={
                      <Pill tone={ticket.status === "resolved" ? "outline" : "tint"}>
                        {ticket.status === "in_progress"
                          ? "In progress"
                          : ticket.status === "resolved"
                            ? "Resolved"
                            : "Open"}
                      </Pill>
                    }
                  />
                ))}
              </div>
            )}
          </Card>
        </section>

        <Card className="flex flex-wrap items-center gap-4 p-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-tint text-tint-foreground">
            <Mail className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">support@aartheducator.in</p>
            <p className="text-xs text-muted-foreground">
              Mon–Sat, 9 AM – 7 PM IST. Institution admins get priority response.
            </p>
          </div>
        </Card>
      </div>

      <ResponsiveDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Raise a ticket"
        description="Tell us what happened — screenshots help a lot."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Ticket raised — we'll email you");
              }}
            >
              Submit ticket
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Subject</span>
          <input placeholder="Quiz share code not working" className={inputClass} />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Type</span>
            <select className={inputClass}>
              <option>Bug</option>
              <option>Question</option>
              <option>Feature</option>
              <option>Account</option>
              <option>Content</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Priority</span>
            <select className={inputClass}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground">Details</span>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary/50"
          />
        </label>
      </ResponsiveDialog>
    </AppShell>
  );
}
