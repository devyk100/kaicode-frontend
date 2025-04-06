"use server"

import { db } from "@/db/client"
import { sessions, sessionToUserMapping } from "@/db/schema"
import { getServerSession } from "next-auth";

export async function CreateSession({
    name,
    is_anyone_allowed,
  }: {
    name: string;
    is_anyone_allowed: boolean;
  }) {
    const user = await getServerSession();
    console.log(user)
    if (!user?.user.email) {
      throw new Error("Unauthorized");
    }
  
    return await db.transaction(async (tx) => {
      const [session] = await tx.insert(sessions).values({
        is_anyone_allowed,
        name,
      }).returning();
  
      await tx.insert(sessionToUserMapping).values({
        is_admin: true,
        sessionId: session.id,
        user_email: user?.user.email!
      });
  
      return session;
    });
  }
  