import { useEffect, useRef, useState } from "react";
import { getEvents, getEventUpdates, watchEvents } from "../api"
import type { CalenderEvent } from "../types";

export const useEvents = () =>{
    const [events, setEvents] = useState<CalenderEvent[]>([]);
    const interval = useRef<NodeJS.Timeout>(null)

    useEffect(() => {

        const startPolling = () => {
            if (interval.current) return;

            interval.current = setInterval(async () => {
                const newEvnts = await getEventUpdates();
                console.log(JSON.stringify(newEvnts))
                if (newEvnts.length > 0) 
                    setEvents(evnt => [...evnt, ...newEvnts]);
            }, 10000);
        };

        const stopPolling = () => {
            if (interval.current)
                clearInterval(interval.current)
            interval.current = null;
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState == "visible")
                startPolling();
            else
                stopPolling();
        }

        (async () => {
            const evnts = await getEvents();
            setEvents(evnt => [...evnt, ...evnts]);
            await watchEvents();
            
        })();

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            stopPolling();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
    }, []);

    return {
        events
    }
}