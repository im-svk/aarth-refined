/* Professional 40×40 workspace tool icons for ListRow slots. */

function ink(t: number) {
  return `var(--ev-${t})`;
}

function wash(t: number) {
  return `var(--ev-${t}-bg)`;
}

function Defs({ id, tone }: { id: string; tone: number }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={wash(tone)} />
        <stop offset="100%" stopColor={ink(tone)} stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--card)" />
        <stop offset="100%" stopColor={wash(tone)} />
      </linearGradient>
    </defs>
  );
}

export function NotesStudioIcon() {
  const tone = 1;
  const id = "ws-notes";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <Defs id={id} tone={tone} />
      {/* rounded plate */}
      <rect x="2" y="2" width="36" height="36" rx="9" fill={`url(#${id}-g)`} />
      {/* back document */}
      <rect x="9" y="8" width="18" height="24" rx="3" fill={ink(tone)} opacity="0.22" transform="rotate(-6 18 20)" />
      {/* front document */}
      <rect x="11" y="7" width="18" height="24" rx="3" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.4" />
      {/* lines */}
      <rect x="14" y="13" width="12" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.35" />
      <rect x="14" y="17.5" width="10" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.22" />
      <rect x="14" y="22" width="12" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.22" />
      {/* sparkle / AI star */}
      <circle cx="28" cy="27" r="6" fill={ink(tone)} />
      <path
        d="M28 23.5l.9 2.6h2.6l-2.1 1.5.8 2.6-2.2-1.6-2.2 1.6.8-2.6-2.1-1.5h2.6z"
        fill="var(--card)"
      />
    </svg>
  );
}

export function QuizBuilderIcon() {
  const tone = 2;
  const id = "ws-quiz";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <Defs id={id} tone={tone} />
      <rect x="2" y="2" width="36" height="36" rx="9" fill={`url(#${id}-g)`} />
      {/* clipboard */}
      <rect x="9" y="7" width="22" height="28" rx="4" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.4" />
      <rect x="15" y="5" width="10" height="5" rx="2.5" fill={ink(tone)} />
      {/* checklist items */}
      <circle cx="14" cy="16.5" r="2.4" fill={ink(tone)} opacity="0.18" />
      <rect x="18.5" y="15.2" width="9" height="2.4" rx="1.2" fill={ink(tone)} opacity="0.18" />
      <circle cx="14" cy="23" r="2.4" fill={ink(tone)} />
      <path d="M12.8 23l.9.9 1.7-1.8" stroke="var(--card)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="18.5" y="21.8" width="7" height="2.4" rx="1.2" fill={ink(tone)} opacity="0.18" />
      <circle cx="14" cy="29.5" r="2.4" fill={ink(tone)} opacity="0.18" />
      <rect x="18.5" y="28.3" width="8" height="2.4" rx="1.2" fill={ink(tone)} opacity="0.18" />
      {/* question mark bubble */}
      <circle cx="29" cy="11" r="5.5" fill={ink(tone)} />
      <path
        d="M29 9.2a1.8 1.8 0 011.4 1.6c0 .9-.6 1.3-1 1.6-.3.2-.4.4-.4.7v.6"
        stroke="var(--card)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="29" cy="14.8" r="0.9" fill="var(--card)" />
    </svg>
  );
}

export function QuestionPapersIcon() {
  const tone = 3;
  const id = "ws-papers";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <Defs id={id} tone={tone} />
      <rect x="2" y="2" width="36" height="36" rx="9" fill={`url(#${id}-g)`} />
      {/* back paper */}
      <rect x="9" y="9" width="18" height="24" rx="2.8" fill={ink(tone)} opacity="0.22" transform="rotate(-5 18 21)" />
      {/* middle paper */}
      <rect x="11" y="8" width="18" height="24" rx="2.8" fill={ink(tone)} opacity="0.35" transform="rotate(3 20 20)" />
      {/* front paper */}
      <rect x="12" y="7" width="18" height="24" rx="2.8" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.4" />
      {/* lines and question mark */}
      <rect x="15" y="13" width="8" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.35" />
      <rect x="15" y="17.5" width="11" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.22" />
      <rect x="15" y="22" width="9" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.22" />
      {/* pencil */}
      <path
        d="M27 26l6-6 2.5 2.5-6 6z"
        fill={ink(tone)}
        opacity="0.9"
      />
      <path
        d="M27 26l-1.2 3.7 3.7-1.2z"
        fill={ink(tone)}
        opacity="0.6"
      />
    </svg>
  );
}

export function PresentationsIcon() {
  const tone = 5;
  const id = "ws-deck";
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <Defs id={id} tone={tone} />
      <rect x="2" y="2" width="36" height="36" rx="9" fill={`url(#${id}-g)`} />
      {/* slide screen */}
      <rect x="6" y="8" width="28" height="19" rx="4" fill="var(--card)" stroke={ink(tone)} strokeWidth="1.4" />
      {/* chart bars */}
      <rect x="10" y="20" width="4" height="5" rx="1" fill={ink(tone)} opacity="0.35" />
      <rect x="16" y="16" width="4" height="9" rx="1" fill={ink(tone)} opacity="0.55" />
      <rect x="22" y="12" width="4" height="13" rx="1" fill={ink(tone)} />
      {/* title line */}
      <rect x="10" y="11.5" width="12" height="2.2" rx="1.1" fill={ink(tone)} opacity="0.25" />
      {/* stand */}
      <path d="M20 27v5M14 32h12" stroke={ink(tone)} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* play badge */}
      <circle cx="30" cy="28" r="5.5" fill={ink(tone)} />
      <path d="M28.5 26l4 2-4 2z" fill="var(--card)" />
    </svg>
  );
}
