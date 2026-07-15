interface MissionHeaderProps {
  sequence: number;
  title: string;
  briefingText: string | null;
}

export function MissionHeader({ sequence, title, briefingText }: MissionHeaderProps) {
  return (
    <div className="w-full space-y-1">
      {/* Mission number with full-width border */}
      <div className="mission-number-row">
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground border-b border-primary pb-2.5 mb-3 w-full block">
          mission <span className="font-semibold text-primary">{String(sequence).padStart(2, '0')}</span>
        </span>
      </div>

      {/* Title – lighter weight, no underline */}
      <h1 className="text-4xl sm:text-5xl font-display leading-tight tracking-tight text-foreground">
        {title}
      </h1>

      {/* Brief – smaller, clean, no vertical line */}
      <p className="text-sm text-muted-foreground leading-relaxed mt-1">
        {briefingText}
      </p>
    </div>
  );
}