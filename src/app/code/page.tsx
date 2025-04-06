import EditorFragment from "@/components/ui/editor";
import { getServerSession } from "next-auth"
import { env } from "process";
import dynamic from "next/dynamic";
import EditorWrapper from "@/components/ui/editor-wrapper";



export default async function CodePage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const user = await getServerSession();
    await searchParams
    const session_id = searchParams.session_id;
    const wsServerUrl = env.WS_URL;
    console.log(wsServerUrl)
    console.log(session_id, "is the session ID")
    return (<>
        <EditorWrapper language="javascript" room={session_id! as string} wsUrl={wsServerUrl! as string} />
    </>)
}