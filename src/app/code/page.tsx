import EditorFragment from "@/components/ui/editor/editor";
import { getServerSession } from "next-auth"
import { env } from "process";
import dynamic from "next/dynamic";
import EditorWrapper from "@/components/ui/editor/editor-wrapper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import JudgeOutputPane from "@/components/ui/judge-output-pane";
import UpperLegendPane from "@/components/ui/editor/upper-legend-pane";
import { getRedisClient } from "@/lib/redis";
import { FetchContent } from "@/actions/fetch-content";

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
    const content = await FetchContent(session_id as string)
    return (<>
    <div>
        <UpperLegendPane />
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={80}>
                <EditorWrapper content={content || ""} language="javascript" room={session_id! as string} wsUrl={wsServerUrl! as string} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <JudgeOutputPane />
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
    </>)
}