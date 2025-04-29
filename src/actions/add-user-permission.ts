"use server"

import { db } from "@/db/client";
import { sessionToUserMapping } from "@/db/schema";

export async function addUserPermission({email, session_id}: {
    email: string;
    session_id: string
}) {
    try  {
        await db.insert(sessionToUserMapping).values({
            is_admin: false,
            sessionId: session_id, 
            user_email: email
        })
    } catch (err) {
        console.log(err)
    }
}