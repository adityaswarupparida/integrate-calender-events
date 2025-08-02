// import { useEffect } from "react";
import { LayoutGrid, StretchHorizontal } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import type { CalenderEvent } from "../types";
import { Eventbar } from "../ui/Eventbar";
import { DateTime } from "luxon";

export const Eventboard = () => {
    const { events: evnts } = useEvents();

    const events: CalenderEvent[] = sort(evnts);

    return (
        <div className="mx-24 mt-12 overflow-hidden">
            {/* <button className="border rounded-xl bg-yellow-300 px-3 py-1 cursor-pointer" onClick={() => {
                (async () => {
                    const evnts = await getEvents();
                    setEvents(evnt => [...evnt, ...evnts]);
                })();
            }}>Get Events</button> */}
            {/* <div>Eventboard</div> */}
            <div className="w-full flex justify-end">
                <div className="flex border rounded-lg">
                    <button className="p-2"><StretchHorizontal /></button>
                    <button className="p-2 bg-white rounded-r-lg"><LayoutGrid stroke="blue" /></button>
                </div>
            </div>
            <div className="overflow-y-auto max-h-4/5">
                <div className="grid grid-cols-5 gap-2">
                    {events.length > 0 && (
                        events.map((event, index) => 
                        <div key={index}>
                            <Eventbar event={event}/>
                            {/* {JSON.stringify(event)} */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const sort = (evnts: CalenderEvent[]) => {
    for (const event of evnts) {
        if (!event.start.dateTime && event.start.date)
            event.start.dateTime = DateTime.fromISO(event.start.date, { zone: event.start.timeZone! })
                                        .startOf('day')
                                        .toISO({ suppressMilliseconds: true });

        if (!event.end.dateTime && event.end.date) 
            event.end.dateTime = DateTime.fromISO(event.end.date, { zone: event.start.timeZone! })
                                        .startOf('day')
                                        .toISO({ suppressMilliseconds: true });
    }

    return evnts.sort((c, d) => new Date(c.start.dateTime!).getTime() - new Date(d.start.dateTime!).getTime());
}