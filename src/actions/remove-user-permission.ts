"use server"

import { db } from "@/db/client";
import { sessionToUserMapping } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function removeUserPermission({email, session_id}: {
    email: string;
    session_id: string;
}) {
        try  {
            await db.delete(sessionToUserMapping).where(and(eq(sessionToUserMapping.sessionId, session_id), eq(sessionToUserMapping.user_email, email)))
        } catch (err) {
            console.log(err)
        }
}