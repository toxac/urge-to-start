// lib/calendar/ics.ts

/**
 * Generate an RFC 5545 compliant .ics file content for a list of events.
 * @param events - Array of events with title, start/end dates (ISO strings), and optional description.
 * @returns String content of the .ics file.
 */
export function generateICS(events: { title: string; start: string; end: string; description?: string }[]): string {
  // Helper to format date to ICS format: YYYYMMDDTHHMMSSZ (UTC)
  const toICSDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Urge// Calendar//EN',
    'CALSCALE:GREGORIAN',
  ];

  events.forEach((event) => {
    const start = toICSDate(event.start);
    const end = toICSDate(event.end);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${crypto.randomUUID()}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title}`,
      ...(event.description ? [`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`] : []),
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Download an ICS file for the user.
 */
export function downloadICS(events: { title: string; start: string; end: string; description?: string }[], filename = 'kip-schedule.ics'): void {
  const content = generateICS(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}