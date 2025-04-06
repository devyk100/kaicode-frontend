import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ available: false });
  }

  const result = await db.select().from(users).where(eq(users.username, username));
  return NextResponse.json({ available: result.length === 0 });
}
