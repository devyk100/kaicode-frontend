import { db } from "@/db/client";
import { sessions, sessionToUserMapping } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function isUserAllowed({ userId, session_id }: {
    userId: string;
    session_id: string;
}): Promise<{isAllowed: boolean, isAdmin: boolean}> {
    const session = await db.select().from(sessions).where(eq(sessions.id, session_id));
    const user_to_session_mapped_entry = await db.select().from(sessionToUserMapping).where(and(eq(sessionToUserMapping.sessionId, session_id), eq(sessionToUserMapping.user_email, userId)))
    if (session.length != 1) {
        return {isAdmin: false, isAllowed: false}
    }
    if (session[0].is_anyone_allowed) {
        return {
            isAllowed: true, isAdmin:user_to_session_mapped_entry[0].is_admin
        }
    } else {
        if(user_to_session_mapped_entry.length != 1) {
            return {isAllowed: false, isAdmin: user_to_session_mapped_entry[0].is_admin}
        }
        return {isAllowed: true, isAdmin: user_to_session_mapped_entry[0].is_admin}
    }
}