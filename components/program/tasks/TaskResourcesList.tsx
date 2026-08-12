// components/program/tasks/TaskResourcesList.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ReferenceSchema } from '@/types/playbook';
import { BookOpen, Lightbulb, ExternalLink, Compass } from 'lucide-react';

interface TaskResourcesListProps {
  resources?: ReferenceSchema[] | null;
}

export function TaskResourcesList({ resources }: TaskResourcesListProps) {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2 text-left">
      <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
        <Compass className="w-3.5 h-3.5 text-amber-500" />
        Recommended Reading & Insights
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {resources.map((res, index) => {
          const isGuide = res.type === 'guide';
          const Icon = isGuide ? BookOpen : Lightbulb;

          return (
            <Link
              key={index}
              href={res.url_link}
              target={res.isInternal ? '_self' : '_blank'}
              className="p-2.5 rounded-lg border border-border bg-card hover:border-primary/40 transition flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isGuide ? 'text-primary' : 'text-amber-500'}`} />
                <span className="font-semibold text-foreground truncate group-hover:text-primary transition">
                  {res.title}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 ml-1 opacity-60 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}