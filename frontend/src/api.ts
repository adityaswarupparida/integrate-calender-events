import axios from "axios"
import type { CalenderEvent } from "./types";

export const getEvents = async () => {
    let events: CalenderEvent[] = [];
    const response = await axios.get(`https://shaggy-rocks-carry.loca.lt/events/`, {
        withCredentials: true
    });
    console.log(response);
    events = response.data.events as CalenderEvent[];
    return events;
}

export const watchEvents = async () => {
    const watchResponse = await axios.get(`https://shaggy-rocks-carry.loca.lt/events/watch`, {
        withCredentials: true
    });
    console.log(watchResponse);
    return watchResponse;
}

export const getEventUpdates = async () => {
    let events: CalenderEvent[] = [];
    const response = await axios.get(`https://shaggy-rocks-carry.loca.lt/events/updates`, {
        withCredentials: true
    });
    console.log(response);
    events = response.data.events as CalenderEvent[];
    return events;
}