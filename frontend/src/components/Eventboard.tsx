// import { useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import { Eventbar } from "../ui/Eventbar";

export const Eventboard = () => {
    const { events } = useEvents();

    return (
        <div className="grow mx-24 mt-12">
            {/* <button className="border rounded-xl bg-yellow-300 px-3 py-1 cursor-pointer" onClick={() => {
                (async () => {
                    const evnts = await getEvents();
                    setEvents(evnt => [...evnt, ...evnts]);
                })();
            }}>Get Events</button> */}
            {/* <div>Eventboard</div> */}
            {events.length > 0 && (
                events.map((event, index) => 
                <div key={index}>
                    <Eventbar event={event}/>
                    {/* {JSON.stringify(event)} */}
                </div>
            ))}
        </div>
    )
}