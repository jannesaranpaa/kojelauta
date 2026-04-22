import { useQuery } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string; // Formatted to "14:00" or "All Day"
    isAllDay: boolean;
}

// 1. THIS RUNS ON THE SERVER
export const fetchCalendarEventsServer = createServerFn({ method: 'GET' })
    .handler(async (): Promise<CalendarEvent[]> => {
        const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
        const calendarId = process.env.GOOGLE_CALENDAR_ID;

        if (!apiKey || !calendarId) {
            throw new Error("Google Calendar credentials missing in .env");
        }

        // Set the window for "Today"
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Construct the Google Calendar API URL
        const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
        url.searchParams.append('key', apiKey);
        url.searchParams.append('timeMin', startOfDay.toISOString());
        url.searchParams.append('timeMax', endOfDay.toISOString());
        url.searchParams.append('singleEvents', 'true'); // Expands recurring events!
        url.searchParams.append('orderBy', 'startTime'); // Returns them in chronological order

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error('Failed to fetch calendar events');
        }

        const data = await response.json();

        // 2. Map Google's clunky format into our clean interface
        const events = data.items?.map((item: any) => {
            // Google uses 'date' for all-day events, and 'dateTime' for specific times
            const isAllDay = !!item.start.date;
            let timeLabel = "All Day";

            if (!isAllDay) {
                const dateObj = new Date(item.start.dateTime);
                timeLabel = dateObj.toLocaleTimeString('en-FI', { hour: '2-digit', minute: '2-digit' });
            }

            return {
                id: item.id,
                title: item.summary || "Busy", // 'summary' is the event title in Google's API
                startTime: timeLabel,
                isAllDay,
            };
        }) || [];

        return events;
    });

// 3. THIS RUNS ON THE CLIENT
export const useCalendarEvents = () => {
    return useQuery({
        queryKey: ['calendar', 'events'],
        queryFn: () => fetchCalendarEventsServer(),
        // Refetching every 15 minutes is plenty for a daily agenda
        refetchInterval: 1000 * 60 * 15,
    });
};
