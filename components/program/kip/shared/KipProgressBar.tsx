// components/program/kip/shared/KipProgressBar.tsx
'use client';

interface Props {
  value: number; // 0-100
  className?: string;
}

export function KipProgressBar({ value, className = '' }: Props) {
  return (
    <div className={`w-full h-1.5 bg-muted rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}