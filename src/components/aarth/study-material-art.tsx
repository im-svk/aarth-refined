function DocumentStack({ className = "h-auto w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 190" className={className} aria-hidden="true">
      <ellipse cx="154" cy="170" rx="116" ry="8" fill="var(--aidocs-line)" opacity=".45" />
      <path d="M38 51a14 14 0 0 1 14-14h119a14 14 0 0 1 14 14v103H52a14 14 0 0 1-14-14Z" fill="var(--aidocs-sky)" />
      <g transform="rotate(-4 127 94)">
        <rect x="66" y="21" width="132" height="143" rx="12" fill="var(--card)" stroke="var(--aidocs-line)" strokeWidth="2" />
        <rect x="84" y="42" width="56" height="8" rx="4" fill="var(--aidocs-blue)" opacity=".22" />
        <rect x="84" y="61" width="94" height="5" rx="2.5" fill="var(--aidocs-ink)" opacity=".12" />
        <rect x="84" y="73" width="77" height="5" rx="2.5" fill="var(--aidocs-ink)" opacity=".12" />
        <rect x="84" y="91" width="94" height="48" rx="8" fill="var(--aidocs-sky)" opacity=".72" />
        <path d="m96 127 17-16 13 10 20-22 20 28" fill="none" stroke="var(--aidocs-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="151" cy="107" r="5" fill="var(--aidocs-yellow)" />
      </g>
      <path d="M197 47c0-8 6-14 14-14h45c8 0 14 6 14 14v38c0 8-6 14-14 14h-14l-15 13V99h-16c-8 0-14-6-14-14Z" fill="var(--aidocs-blue)" />
      <path d="m232 47 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="var(--primary-foreground)" />
      <path d="M216 78h32" stroke="var(--primary-foreground)" strokeWidth="4" strokeLinecap="round" opacity=".55" />
      <circle cx="255" cy="126" r="20" fill="var(--aidocs-yellow)" stroke="var(--card)" strokeWidth="5" />
      <path d="m247 126 6 6 11-13" fill="none" stroke="var(--aidocs-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49 23v16M41 31h16M223 138v12M217 144h12" stroke="var(--aidocs-blue)" strokeWidth="2.5" strokeLinecap="round" opacity=".45" />
    </svg>
  );
}

export function StudyMaterialHeroArt() {
  return <DocumentStack className="h-auto w-full max-w-[300px]" />;
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