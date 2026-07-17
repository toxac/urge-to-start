// hooks/useKipCalendar.ts
import { downloadICS } from '@/lib/calendar/ics';

export function useKipCalendar() {
  const generateAndDownloadICS = (events: { title: string; start: string; end: string; description?: string }[]) => {
    downloadICS(events);
  };

  return { generateAndDownloadICS };
}