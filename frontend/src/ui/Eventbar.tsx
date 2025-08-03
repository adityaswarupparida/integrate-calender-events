import type { CalenderEvent } from "../types";

export const Eventbar = ({ event, layout }: {
    event: CalenderEvent;
    layout: string
}) => {

    const startTime = new Date(event.start.dateTime!);
    const endTime = new Date(event.end.dateTime!);

    return (
        <div className="px-4 py-3 w-full bg-gradient-to-l from-yellow-400 to-amber-300 rounded-lg mb-3">
            <p className="font-bold text-3xl font-bitcount">{event.summary}</p>
            <p className="font-semibold text-xl font-lora-italic capitalize">{event.eventType}</p>
            <div className="flex flex-col text-lg">
                <p>Start - {startTime.toLocaleDateString()} {startTime.toLocaleTimeString()}</p>
                <p>End - {endTime.toLocaleDateString()} {endTime.toLocaleTimeString()}</p>
            </div>
                       
            <div>Organizer - {event.organizer.email}</div>
            <div className="capitalize">Status - {event.status}</div>
        </div>
    )
}