function DocumentStack({ className = "h-auto w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 180" className={className} aria-hidden="true">
      <rect x="24" y="32" width="120" height="128" rx="12" fill="var(--aidocs-sky)" />
      <rect x="50" y="18" width="132" height="138" rx="12" fill="var(--card)" stroke="var(--aidocs-line)" strokeWidth="2" />
      <rect x="72" y="43" width="70" height="9" rx="4.5" fill="var(--aidocs-blue)" opacity=".2" />
      <rect x="72" y="64" width="86" height="6" rx="3" fill="var(--aidocs-ink)" opacity=".12" />
      <rect x="72" y="78" width="74" height="6" rx="3" fill="var(--aidocs-ink)" opacity=".12" />
      <rect x="72" y="92" width="82" height="6" rx="3" fill="var(--aidocs-ink)" opacity=".12" />
      <path d="M77 127l17-16 13 11 19-27 28 32H77Z" fill="var(--aidocs-blue)" opacity=".18" />
      <path d="M77 127l17-16 13 11 19-27 28 32" fill="none" stroke="var(--aidocs-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="214" cy="82" r="43" fill="var(--aidocs-sky)" stroke="var(--aidocs-line)" strokeWidth="2" />
      <path d="M202 61h27a8 8 0 0 1 8 8v25a8 8 0 0 1-8 8h-7l-11 10v-10h-9a8 8 0 0 1-8-8V69a8 8 0 0 1 8-8Z" fill="var(--aidocs-blue)" />
      <path d="m216 70 2.2 6.2 6.3 2.2-6.3 2.2-2.2 6.2-2.2-6.2-6.3-2.2 6.3-2.2 2.2-6.2Z" fill="var(--primary-foreground)" />
      <circle cx="242" cy="43" r="11" fill="var(--aidocs-yellow)" />
      <path d="M242 36v14M235 43h14" stroke="var(--aidocs-ink)" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 159h226" stroke="var(--aidocs-line)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StudyMaterialHeroArt() {
  return <DocumentStack className="h-auto w-full max-w-[280px]" />;
}

export function StudyDocumentIcon({ tone = 1 }: { tone?: 1 | 2 | 3 | 4 }) {
  const fills = {
    1: ["var(--aidocs-sky)", "var(--aidocs-blue)"],
    2: ["var(--ev-2-bg)", "var(--ev-2)"],
    3: ["var(--ev-4-bg)", "var(--ev-4)"],
    4: ["var(--ev-5-bg)", "var(--ev-5)"],
  } as const;
  const [plate, ink] = fills[tone];
  return (
    <svg viewBox="0 0 44 44" className="size-11" aria-hidden="true">
      <rect x="1" y="1" width="42" height="42" rx="11" fill={plate} />
      <rect x="11" y="7" width="23" height="30" rx="4" fill="var(--card)" stroke={ink} strokeWidth="1.6" />
      <path d="M27 7v7h7" fill={plate} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 20h13M16 25h13M16 30h8" stroke={ink} strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
      <circle cx="12" cy="33" r="5" fill={ink} />
      <path d="m12 29.9.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" fill="var(--card)" />
    </svg>
  );
}

export function TemplateIcon({ kind }: { kind: "notes" | "lesson" | "summary" }) {
  if (kind === "lesson") {
    return (
      <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="var(--ev-2-bg)" />
        <rect x="8" y="7" width="24" height="27" rx="4" fill="var(--card)" stroke="var(--ev-2)" strokeWidth="1.5" />
        <path d="M8 14h24M15 5v5M25 5v5" stroke="var(--ev-2)" strokeWidth="1.7" strokeLinecap="round" />
        <path d="m14 23 3 3 8-8" fill="none" stroke="var(--ev-2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "summary") {
    return (
      <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="var(--ev-4-bg)" />
        <path d="M10 10h20v21H10z" fill="var(--card)" stroke="var(--ev-4)" strokeWidth="1.5" />
        <path d="M15 16h10M15 21h10M15 26h6" stroke="var(--ev-4)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="29" cy="11" r="5" fill="var(--aidocs-yellow)" />
        <path d="m29 8.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" fill="var(--aidocs-ink)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
      <rect x="2" y="2" width="36" height="36" rx="10" fill="var(--aidocs-sky)" />
      <rect x="10" y="7" width="21" height="27" rx="4" fill="var(--card)" stroke="var(--aidocs-blue)" strokeWidth="1.5" />
      <path d="M15 15h11M15 20h11M15 25h7" stroke="var(--aidocs-blue)" strokeWidth="1.8" strokeLinecap="round" opacity=".6" />
      <path d="m29 25 5-5 2 2-5 5-3 1Z" fill="var(--aidocs-blue)" />
    </svg>
  );
}