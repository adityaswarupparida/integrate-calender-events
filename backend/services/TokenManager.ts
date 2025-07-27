import redis from "../database";

export class TokenManager {
    private key: string;

    constructor(id: string) {
        this.key = id;
    }

    getKey() {
        return this.key;
    }

    async saveTokens(accessToken: string, refreshToken: string) {
        console.log("checkpoint 1.1.1");
        console.log(this.key, accessToken, refreshToken);
        await redis.SET(`AT:${this.key}`, accessToken, { 
            expiration: {
                type: "EX",
                value: 600
            } 
        })
        await redis.HSET(this.key, "refresh_token", refreshToken);
        console.log("checkpoint 1.1.2");
    };

    async getAccessToken() {
        const data = await redis.HGETALL(this.key);
        const { access_token, refresh_token } = data;

        // Token valid
        if (access_token) return access_token;
        // Token expired
        if (!refresh_token) {
            throw new Error("Missing or invalid refresh token - user needs to re-authenticate.");
        }

        const response = await fetch("https://www.googleapis.com/oauth2/v4/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                  "client_id": process.env.GOOGLE_CLIENT_ID,
                  "client_secret": process.env.GOOGLE_CLIENT_SECRET,
                  "refresh_token": refresh_token,
                  "grant_type": "refresh_token"
            })
        })

        const result = await response.json();
        console.log(result);

        await redis.SET(`AT:${this.key}`, result.access_token as string, { 
            expiration: "KEEPTTL" 
        })

        return result.access_token as string;
    }

    async getSyncToken() {
        const syncToken = await redis.HGET(this.key, "sync_token");
        return syncToken;
    }

    async setSyncToken(syncToken: string) {
        await redis.HSET(this.key, "sync_token", syncToken);
    }
}