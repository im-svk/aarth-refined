import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  hint: string;
  cta: string;
  to: "/aidocs" | "/quizzes" | "/presentations";
  tone: string;
  art: () => React.ReactElement;
};

function NotesArt() {
  return (
    <svg viewBox="0 0 120 100" className="size-full" aria-hidden="true">
      <defs>
        <linearGradient id="nb-p" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.72" />
        </linearGradient>
      </defs>
      <rect x="22" y="14" width="58" height="74" rx="8" fill="#ffffff" opacity="0.28" transform="rotate(-8 51 51)" />
      <rect x="30" y="10" width="58" height="76" rx="8" fill="url(#nb-p)" />
      <rect x="38" y="24" width="34" height="5" rx="2.5" fill="var(--ev-4)" />
      <rect x="38" y="36" width="42" height="4" rx="2" fill="#0f172a" opacity="0.22" />
      <rect x="38" y="46" width="38" height="4" rx="2" fill="#0f172a" opacity="0.18" />
      <rect x="38" y="56" width="42" height="4" rx="2" fill="#0f172a" opacity="0.18" />
      <rect x="38" y="66" width="24" height="4" rx="2" fill="#0f172a" opacity="0.14" />
      <circle cx="93" cy="70" r="15" fill="var(--ev-4)" opacity="0.95" />
      <path d="M87 70h12M93 64v12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function QuizArt() {
  return (
    <svg viewBox="0 0 120 100" className="size-full" aria-hidden="true">
      <rect x="26" y="12" width="62" height="72" rx="10" fill="#ffffff" opacity="0.9" />
      <rect x="36" y="26" width="28" height="5" rx="2.5" fill="var(--ev-2)" />
      {[42, 56, 70].map((y, i) => (
        <g key={y}>
          <circle cx="41" cy={y} r="5.5" fill={i === 1 ? "var(--ev-2)" : "#0f172a"} opacity={i === 1 ? 1 : 0.14} />
          {i === 1 && <path d="M38.6 56.2l1.8 1.9 3.4-3.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />}
          <rect x="52" y={y - 2.5} width={i === 0 ? 30 : i === 1 ? 24 : 28} height="5" rx="2.5" fill="#0f172a" opacity="0.16" />
        </g>
      ))}
      <circle cx="95" cy="30" r="14" fill="var(--ev-2)" />
      <path d="M91 26.5a4 4 0 116 3.4v1.6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="97" cy="36" r="1.6" fill="#fff" />
    </svg>
  );
}

function DeckArt() {
  return (
    <svg viewBox="0 0 120 100" className="size-full" aria-hidden="true">
      <rect x="24" y="16" width="72" height="48" rx="8" fill="#ffffff" opacity="0.92" />
      <rect x="32" y="26" width="26" height="5" rx="2.5" fill="var(--ev-5)" />
      <rect x="32" y="37" width="34" height="4" rx="2" fill="#0f172a" opacity="0.16" />
      <rect x="32" y="46" width="22" height="4" rx="2" fill="#0f172a" opacity="0.12" />
      <rect x="70" y="34" width="18" height="20" rx="4" fill="var(--ev-5)" opacity="0.85" />
      <path d="M60 64v10M46 80h28" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" opacity="0.75" />
      <circle cx="99" cy="72" r="11" fill="var(--ev-5)" />
      <path d="M95.5 72l2.6 2.7 5-5.4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const SLIDES: Slide[] = [
  {
    id: "notes",
    eyebrow: "AI content studio",
    title: "Create Notes",
    hint: "Turn any chapter into clean, printable study notes.",
    cta: "Start writing",
    to: "/aidocs",
    tone: "linear-gradient(135deg, oklch(0.45 0.13 255), oklch(0.58 0.12 245))",
    art: NotesArt,
  },
  {
    id: "quiz",
    eyebrow: "Assess in minutes",
    title: "Create a Quiz",
    hint: "Auto-generate MCQs, share a code, collect responses.",
    cta: "Build quiz",
    to: "/quizzes",
    tone: "linear-gradient(135deg, oklch(0.42 0.12 268), oklch(0.55 0.13 300))",
    art: QuizArt,
  },
  {
    id: "deck",
    eyebrow: "Teach visually",
    title: "Make a Presentation",
    hint: "Slide decks from your lesson plan, ready for class.",
    cta: "Open studio",
    to: "/presentations",
    tone: "linear-gradient(135deg, oklch(0.40 0.11 232), oklch(0.54 0.12 200))",
    art: DeckArt,
  },
];

export function CreateBanner({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const startX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % SLIDES.length);
    }, 5200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${className}`}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onTouchStart={(e) => {
        paused.current = true;
        startX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        paused.current = false;
        const s = startX.current;
        const end = e.changedTouches[0]?.clientX ?? null;
        if (s !== null && end !== null && Math.abs(end - s) > 40) go(index + (end < s ? 1 : -1));
        startX.current = null;
      }}
    >
      <div
        className="flex transition-transform duration-500 ease-[var(--ease-ui)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="w-full shrink-0" style={{ background: slide.tone }}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 pb-8 sm:gap-4 sm:p-5 sm:pb-9">
              <div className="min-w-0">
                <p className="eyebrow text-[11px] text-white/65">{slide.eyebrow}</p>
                <h2 className="display mt-1 text-[1.15rem] leading-tight text-white sm:text-xl">
                  {slide.title}
                </h2>
                <p className="mt-1 text-[12px] leading-snug text-white/75">{slide.hint}</p>
                <Link to={slide.to}>
                  <span className="press mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3.5 text-[12px] font-semibold text-slate-900">
                    {slide.cta} <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </div>
              <div className="pointer-events-none h-16 aspect-[6/5] sm:h-20">{slide.art()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show ${slide.title}`}
            onClick={() => go(i)}
            className="press h-1.5 rounded-full bg-white transition-all duration-300"
            style={{ width: i === index ? 20 : 6, opacity: i === index ? 0.95 : 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}
