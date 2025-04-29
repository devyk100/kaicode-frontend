import { db } from "@/db/client";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DoesSessionExist({
    session_id
}:{session_id: string}) {
    const result = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, session_id))
    .limit(1);
    return result.length > 0;
}