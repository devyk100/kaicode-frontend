// File: app/api/ask/route.ts
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { env } from "process";

export async function POST(req: NextRequest) {
    const user = await getServerSession();
    console.log(user, "is the user on the next js POST completions endpoint")
    const body = await req.json();
    console.log(body)
    return new Response(JSON.stringify({"success": true}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
