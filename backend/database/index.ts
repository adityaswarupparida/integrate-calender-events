import { createClient } from "redis";

const redis = await createClient()
    .connect();

export default redis;