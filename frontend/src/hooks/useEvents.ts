import { useEffect, useState } from "react";
import { getEvents, getEventUpdates, watchEvents } from "../api"
import type { CalenderEvent } from "../types";

export const useEvents = () =>{
    const [events, setEvents] = useState<CalenderEvent[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        (async () => {
            const evnts = await getEvents();
            setEvents(evnt => [...evnt, ...evnts]);

            await watchEvents();

            interval = setInterval(async () => {
                const newEvnts = await getEventUpdates();
                if (newEvnts.length > 0) 
                    setEvents(evnt => [...evnt, ...newEvnts]);
            }, 10000);
        })();

        return () => {
            if (interval) clearInterval(interval)
        }
    }, []);

    return {
        events
    }
}