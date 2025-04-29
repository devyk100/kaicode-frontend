import { db } from "@/db/client"
import { sessions, sessionToUserMapping } from "@/db/schema"
import { desc, eq } from "drizzle-orm";



export async function getSessionsForUser(userEmail: string) {
    const sessionsForUser = await db
      .select({
        id: sessions.id,
        name: sessions.name,
        content: sessions.content,
        whiteboardContent: sessions.whiteboardContent,
        isAnyoneAllowed: sessions.is_anyone_allowed,
      })
      .from(sessions)
      .innerJoin(
        sessionToUserMapping,
        eq(sessions.id, sessionToUserMapping.sessionId)
      )
      .where(eq(sessionToUserMapping.user_email, userEmail))
      .orderBy(desc(sessions.id));
    return sessionsForUser;
  }
  