/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: {
    date: string; // YYYY-MM-DD for all-day events
  };
  end: {
    date: string;
  };
}

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export async function createCalendarEvent(accessToken: string, event: GoogleCalendarEvent) {
  const response = await fetch(CALENDAR_API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create calendar event');
  }

  return await response.json();
}

export async function updateCalendarEvent(accessToken: string, eventId: string, event: GoogleCalendarEvent) {
  const response = await fetch(`${CALENDAR_API_BASE}/${eventId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update calendar event');
  }

  return await response.json();
}

export async function deleteCalendarEvent(accessToken: string, eventId: string) {
  const response = await fetch(`${CALENDAR_API_BASE}/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to delete calendar event');
  }
}
