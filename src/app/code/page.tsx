import EditorFragment from "@/components/ui/editor/editor";
import { getServerSession } from "next-auth"
import { env, permission } from "process";
import dynamic from "next/dynamic";
import EditorWrapper from "@/components/ui/editor/editor-wrapper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import JudgeOutputPane from "@/components/ui/judge-output-pane";
import UpperLegendPane from "@/components/ui/editor/upper-legend-pane";
import { getRedisClient } from "@/lib/redis";
import { FetchContent } from "@/actions/fetch-content";
import { DoesSessionExist } from "@/actions/does-session-exist";
import { notFound } from "next/navigation";
import ResponsiveEditorWrapper from "@/components/ui/editor/responsive-editor-wrapper";
import { isUserAllowed } from "@/actions/is-user-allowed";

export default async function CodePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {

    const session_id = searchParams.session_id;
    const wsServerUrl = env.WS_URL;

    const user = await getServerSession();
    // basic gatekeeping
    let permissions;
    try {
        const exists = await DoesSessionExist({ session_id: session_id as string })
        if (!exists) {
            notFound()
        }
        permissions = await isUserAllowed({
            session_id: session_id as string,
            userId: user?.user.email as string
        })
        if (!permissions.isAllowed) {
            notFound();
        }
    } catch {
        notFound()
    }
    const content = await FetchContent(session_id as string)
    const defaultLanguage = "python"
    return (<>
        <div className="h-full">
            <UpperLegendPane defaultLanguage={defaultLanguage} />
            <ResizablePanelGroup direction="horizontal" className="h-full relative">
                <ResponsiveEditorWrapper isAdmin={permissions.isAdmin} content={content} defaultLanguage={defaultLanguage} session_id={session_id as string} wsServerUrl={wsServerUrl as string} />
            </ResizablePanelGroup>
        </div>
    </>)
}