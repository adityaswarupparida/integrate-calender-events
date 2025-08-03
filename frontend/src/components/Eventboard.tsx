// import { useEffect } from "react";
import { AlignJustify, LayoutGrid } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import type { CalenderEvent } from "../types";
import { Eventbar } from "../ui/Eventbar";
import { DateTime } from "luxon";
import { useState } from "react";

export const Eventboard = () => {
    const { events: evnts } = useEvents();
    const [layout, setLayout] = useState("grid"); 
    const events: CalenderEvent[] = sort(evnts);

    return (
        <div className="mx-24 mt-12 overflow-hidden">
            <div className="w-full flex justify-end mb-2">
                <div className="flex border border-amber-500 rounded-lg">
                    {layout == "grid" && <div>
                        <button className="p-2" onClick={() => setLayout("flex")}><AlignJustify stroke="oklch(76.9% 0.188 70.08)" /></button>
                        <button className="p-2 bg-yellow-400 rounded-r-lg" onClick={() => setLayout("grid")}><LayoutGrid stroke="white" /></button>
                    </div>}
                    {layout == "flex" && <div>
                        <button className="p-2 bg-yellow-400 rounded-l-lg" onClick={() => setLayout("flex")}><AlignJustify stroke="white" /></button>
                        <button className="p-2" onClick={() => setLayout("grid")}><LayoutGrid stroke="oklch(76.9% 0.188 70.08)" /></button>
                    </div>}
                </div>
            </div>
            <div className="overflow-y-auto max-h-4/5">
                <div className={`grid ${layout == 'grid' ? 'grid-cols-5': 'grid-cols-1'} gap-3`}>
                    {events.length > 0 && (
                        events.map((event, index) => 
                        <div key={index}>
                            <Eventbar event={event} layout={layout} />
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

    return evnts.sort((c, d) => new Date(c.start.dateTime!).getTime() - new Date(d.start.dateTime!).getTime()).slice(0, 50);
}