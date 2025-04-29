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
import { DoesSessionExist } from "@/actions/does-session-exist";
import { notFound } from "next/navigation";

export default async function CodePage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const user = await getServerSession();
    const session_id = searchParams.session_id;
    const wsServerUrl = env.WS_URL;

    // basic gatekeeping
    try {
        const exists = await DoesSessionExist({session_id: session_id as string})
        if(!exists) {
            notFound()
        }

    } catch {
        notFound()
    }
    const content = await FetchContent(session_id as string)
    const defaultLanguage = "python"
    return (<>
    <div>
        <UpperLegendPane defaultLanguage={defaultLanguage} />
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={80} maxSize={90} minSize={40}>
                <EditorWrapper content={content || ""} defaultLanguage={defaultLanguage} room={session_id! as string} wsUrl={wsServerUrl! as string} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <JudgeOutputPane />
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
    </>)
}