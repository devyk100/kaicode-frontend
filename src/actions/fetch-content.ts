import { db } from "@/db/client";
import { sessions } from "@/db/schema";
import { getRedisClient } from "@/lib/redis";
import { eq } from "drizzle-orm";



export async function FetchContent(session_id: string): Promise<string> {
    const redis = await getRedisClient();
    let content = await redis.get(`doc:${session_id}`);
    if(content == null || content == "") {
        const session = await db.select().from(sessions).where(eq(sessions.id, session_id));
        if(session.length > 1 || session.length < 1) {
            throw Error();
        } else {
            if(session[0].content != null) {
                content = String(session[0].content)!
            } else {
                content = ""
            }
        }
        console.log("FROM THE DB", content)
    }
    // if the content is not inside the redis, FETCH FROM THE DB DUDE, AND PUT IT AGAIN IN REDIS WITH AN EXPIRY OF DEBOUNCE INTERVAL
    return content!
}