import { Router } from "express";
import type { SessionUser } from "../types";
import { EventManager } from "../services/EventManager";
import redis from "../database";

const router = Router();

router.get('/', async (req, res) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        res.status(403).json({
            message: "Unauthorized"
        })
        res.redirect("/");
    }

    const { profile } = req.user as SessionUser;
    const eventMngr = new EventManager(profile.id); 
    await eventMngr.init();

    // const syncToken = await (eventMngr.getToken()).getSyncToken();
    console.log("Checkpoint1");
    const { events, syncToken: newToken } = await eventMngr.fetchCalendarEvents(null);
    console.log("Checkpoint2");
    eventMngr.getToken().setSyncToken(newToken);
    console.log(events?.length);

    res.json({ 
        events 
    });
});

router.get("/watch", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            message: "Unauthorized"
        })
        res.redirect("/");
    }
    const { profile } = req.user as SessionUser;
    const eventMngr = new EventManager(profile.id); 
    await eventMngr.init();

    try {
        const result = await eventMngr.setupWebhook();
        res.status(200).json({
            result
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
})

router.post("/handle", async (req, res) => {
    console.log(`[Webhook] Event change detected on channel ${req.headers['x-goog-channel-id']}: ${req.headers['x-goog-resource-state']}`);
    console.log(req.headers);
    // Here need to map channelId → userId -> req.user -> undefined as user is not hitting this ep
    // console.log(req.user);
    const channelId = req.headers['x-goog-channel-id'];
    const userId = await redis.GET(channelId as string);
    await redis.LPUSH('Channels', JSON.stringify({ 
        channelId: req.headers['x-goog-channel-id'], 
        resourceId: req.headers['x-goog-resource-id'],
        userId: userId
    }));
    if (!userId) { 
        throw new Error(`User Id not found`);
    } 
    const eventMngr = new EventManager(userId);

    const syncToken = await (eventMngr.getToken()).getSyncToken();
    const { events, syncToken: newToken } = await eventMngr.fetchCalendarEvents(syncToken);
    eventMngr.getToken().setSyncToken(newToken);
    console.log(events?.length);
    console.log(events);

    if (events && events.length > 0) {
        await redis.LPUSH(`${userId}:NewEvents`, events.map(e => JSON.stringify(e)));
    }

    res.status(200).json({ 
        events 
    });
});

router.get("/updates", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            message: "Unauthorized"
        })
        res.redirect("/");
    }

    const { profile } = req.user as SessionUser;
    const rawEvents = await redis.LRANGE(`${profile.id}:NewEvents`, 0, -1);
    await redis.DEL(`${profile.id}:NewEvents`);

    const events = rawEvents.map(e => JSON.parse(e));
    if (events.length > 0) {
        res.status(200).json({
            events
        })
        return;
    }
    res.json({
        events: []
    })
})

export default router;
