export type CalenderEvent = {
    id: string;
    eventType: string;
    created: string;
    updated: string;
    start: EventDateTime;
    end: EventDateTime;
    summary: string;
    description?: string;
    status: string;
    htmlLink: string;
    organizer: User;
    visibility: string;
}

type User = {
    displayName?: string;
    email?: string;
    id?: string;
    self?: boolean;
}

type EventDateTime = {
    // yyyy-mm-dd
    date?: string | null;
    dateTime?: string | null;
    timeZone?: string | null;
}