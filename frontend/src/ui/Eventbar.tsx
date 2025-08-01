import type { CalenderEvent } from "../types";

export const Eventbar = ({ event }: {
    event: CalenderEvent
}) => {
    return (
        <div className="px-4 py-3 w-full bg-gradient-to-l from-yellow-200 via-green-200 to-amber-300 rounded-lg mb-3">
            <p className="font-semibold text-xl">Type - {event.eventType}</p>
            <p className="font-bold text-2xl">Title - {event.summary}</p>
            <div className="flex justify-between text-lg">
                <p>Start - {event.start.date}</p>
                <p>End - {event.end.date}</p>
            </div>
                       
            <div>Organizer - {event.organizer.email}</div>
            <div>Status - {event.status}</div>
        </div>
    )
}