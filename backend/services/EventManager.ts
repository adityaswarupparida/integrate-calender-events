import { v4 as uuidv4 } from "uuid";
import { calendar_v3, google } from 'googleapis';
import { TokenManager } from "./TokenManager";
import redis from "../database";
const calendar = google.calendar({ version:'v3' });

export class EventManager {
    private token: TokenManager;

    constructor(userId: string) {
        this.token = new TokenManager(userId);
    }

    async init() {
        const accessToken = await this.token.getAccessToken();
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        google.options({auth: oauth2Client});
    }

    getToken() {
        return this.token;
    }

    async fetchCalendarEvents(syncToken: string | null) {
        // console.log("Checkpoint3");

        const fetchEvents = async (params: calendar_v3.Params$Resource$Events$List) => {
            const response = await calendar.events.list(params);
            return {
                events: response.data.items,
                syncToken: response.data.nextSyncToken as string, // ← STORE THIS
            };
        };

        const baseParams: calendar_v3.Params$Resource$Events$List = {
            calendarId: 'primary',
            singleEvents: true,
            maxResults: 250,
        };
        // console.log("Checkpoint3.a");

        try {
            const params = { ...baseParams };
 
            // First time? No sync token → do full sync
            if (!syncToken) {
                params.timeMin = new Date().toISOString(); // or fetch past events too
            } else {
                params.syncToken = syncToken;
            }

            // console.log("Checkpoint3.b");
            return await fetchEvents(params);

        } catch (error: any) {
            // console.error("Checkpoint4 "+ error);
            const errorCode = error?.errors?.[0]?.reason || error?.response?.data?.error?.errors?.[0]?.reason;
            console.log(error);
            console.error(errorCode);

            if (errorCode === "fullSyncRequired" || errorCode === "gone") {
                console.warn("Sync token invalid. Falling back to full sync...");
                const fullSyncParams = {
                    ...baseParams,
                    timeMin: new Date().toISOString(),
                };
                return await fetchEvents(fullSyncParams);
            }

            console.error("Unhandled Google Calendar API error:", error);
            throw error;
        }
        
    }
    async setupWebhook() {

        console.log("checkpoint a");
        const oldChannels = await redis.LRANGE("Channels", 0, -1);
        console.log(oldChannels.length)
        for (const channl of oldChannels) {
            try {
                // console.log("checkpoint b", channl);
                console.log("Cleaning "+channl);
                const { channelId, resourceId, userId } = JSON.parse(channl)
                await google.calendar('v3').channels.stop({
                    requestBody: {
                        id: channelId,
                        resourceId: resourceId,
                    },
                });

                await redis.DEL(channelId);
            } catch (error: any) {
                const reason = error?.response?.data?.error?.errors?.[0]?.reason;

                if (reason === 'notFound') {
                    console.warn(`Channel not found: likely already stopped. Continuing.`);
                } else {
                    console.error("Failed to stop channel:", error);
                    throw error; // Optional: or just continue if you want soft failure
                }
            }
        }
        // console.log("checkpoint c");

        const channelId = uuidv4();
        const userId = this.token.getKey();
        await redis.SET(channelId, userId);

        const res = await calendar.events.watch({
            calendarId: "primary",
            singleEvents: true,
            orderBy: "startTime",
            requestBody: {
                id: channelId,
                type: "webhook",
                address: `${process.env.BACKEND_URL}/events/handle`
            }
        });
        return res;
    }
}