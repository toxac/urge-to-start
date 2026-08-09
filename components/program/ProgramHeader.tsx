// components/program/ProgramHeader.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgramHeaderProps {
  type: 'mission' | 'quest';
  title: string;
  sequence: number;
  /** Optional subtitle (e.g., big_question for mission) */
  subtitle?: string | null;
  /** Formatted estimated time string, e.g. "~3 days" or "~15 min in-app, 10 min off-app" */
  estimatedTime?: string;
  /** Video URL if available */
  videoUrl?: string | null;
}

export function ProgramHeader({
  type,
  title,
  sequence,
  subtitle,
  estimatedTime,
  videoUrl,
}: ProgramHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
          {type === 'mission' ? 'Mission Brief' : 'Quest Work Center'}
        </span>
      </div>

      {/* Header Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
            {type === 'mission' ? `Mission 0${sequence}` : `Quest 0${sequence}`}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-medium text-muted-foreground italic pt-1">
            &ldquo;{subtitle}&rdquo;
          </p>
        )}
        {estimatedTime && (
          <p className="text-xs font-medium text-muted-foreground">
            Estimated: {estimatedTime}
          </p>
        )}
      </div>

      {/* Video Player */}
      {videoUrl && (
        <div className="aspect-video rounded-xl overflow-hidden border border-border bg-black/5">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}