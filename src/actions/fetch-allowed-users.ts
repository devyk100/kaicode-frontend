"use server"

import { db } from "@/db/client"
import { sessionToUserMapping } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function fetchAllowedUsers({session_id}: {session_id: string}) {
    const mappings = await db.select().from(sessionToUserMapping).where(eq(sessionToUserMapping.sessionId, session_id));
    return mappings;
}