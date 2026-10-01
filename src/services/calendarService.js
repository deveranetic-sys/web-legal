/**
 * Calendar Integration Service for Legal Management System
 * Supports generating standard .ics (iCalendar) files and direct Google Calendar URLs
 */

// Helper to format date string (YYYY-MM-DD) into iCal and Google date format (YYYYMMDDTHHmmssZ)
export function formatDateToCalendarString(dateStr, timeStr = '09:00:00') {
  if (!dateStr) return '';
  const cleanDate = dateStr.replace(/[^0-9-]/g, '').slice(0, 10);
  const parts = cleanDate.split('-');
  if (parts.length < 3) return '';
  
  const year = parts[0];
  const month = parts[1].padStart(2, '0');
  const day = parts[2].padStart(2, '0');
  
  const cleanTime = timeStr.replace(/[^0-9:]/g, '');
  const [hours = '09', minutes = '00', seconds = '00'] = cleanTime.split(':');
  
  return `${year}${month}${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}${seconds.padStart(2, '0')}Z`;
}

/**
 * Generate standard .ics file and trigger download
 */
export function downloadICalFile({ title, description, location = 'Jakarta, Indonesia', startDate, endDate }) {
  const start = formatDateToCalendarString(startDate, '09:00:00');
  const end = formatDateToCalendarString(endDate || startDate, '11:00:00');
  const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const uid = `legal-lms-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@nusantara-energi.co.id`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PT Nusantara Energi//Legal Management System//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${description ? description.replace(/\n/g, '\\n') : ''}`,
    `LOCATION:${location.replace(/\n/g, ' ')}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'DESCRIPTION:Pengingat Agenda Legal Department (H-1)',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate Google Calendar direct URL
 */
export function getGoogleCalendarUrl({ title, description, location = 'Jakarta, Indonesia', startDate, endDate }) {
  const start = formatDateToCalendarString(startDate, '09:00:00');
  const end = formatDateToCalendarString(endDate || startDate, '11:00:00');
  
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: title,
    dates: `${start}/${end}`,
    details: description || '',
    location: location || 'Jakarta, Indonesia',
    add: 'tohalegal@gmail.com'
  });

  return `${baseUrl}&${params.toString()}`;
}

/**
 * Open Google Calendar in new tab
 */
export function openGoogleCalendar(event) {
  const url = getGoogleCalendarUrl(event);
  window.open(url, '_blank', 'noopener,noreferrer');
}
