import { getRedisClient } from "@/lib/redis";



export async function FetchContent(session_id: string): Promise<string> {
    const redis = await getRedisClient();
    const content = await redis.get(`doc:${session_id}`);

    // if the content is not inside the redis, FETCH FROM THE DB DUDE, AND PUT IT AGAIN IN REDIS WITH AN EXPIRY OF DEBOUNCE INTERVAL
    return content!
}