// File: app/api/ask/route.ts
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { env } from "process";

export async function POST(req: NextRequest) {
    const user = await getServerSession();
    console.log(user, "is the user on the next js POST completions endpoint")
    const { prompt, prefix } = await req.json();

    const controller = new AbortController();
    console.log(env.DEEPSEEK_API_URL, env.DEEPSEEK_AUTH_TOKEN)
    const response = await fetch(env.DEEPSEEK_API_URL as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.DEEPSEEK_AUTH_TOKEN as string}`,
        },
        body: JSON.stringify({
            model: "deepseek-coder",
            stream: false,
            messages: [
                { role: "user", content: `${prompt}\n${prefix}` },
            ],
            temperature: 0.0,
            max_tokens: 5,
        }),
        signal: controller.signal,
    });

    const data = await response.json();
    console.log(data, "is the data from deepseek")
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
