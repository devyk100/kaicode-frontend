"use server"

import { db } from "@/db/client";
import { sessions, sessionToUserMapping } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function deleteSession({ session_id, email }: {
    session_id: string;
    email: string
}) {
    try {
        await db.transaction(async (tx) => {
            const mapping = await tx.query.sessionToUserMapping.findFirst({
                where: and(
                    eq(sessionToUserMapping.sessionId, session_id),
                    eq(sessionToUserMapping.user_email, email),
                    eq(sessionToUserMapping.is_admin, true)
                ),
            });

            if (!mapping) throw new Error("Only admin can delete the session");

            await tx.delete(sessionToUserMapping).where(eq(sessionToUserMapping.sessionId, session_id));
            await tx.delete(sessions).where(eq(sessions.id, session_id));
        });
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}