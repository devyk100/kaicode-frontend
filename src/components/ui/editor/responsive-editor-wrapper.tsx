"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import JudgeOutputPane from "../judge-output-pane";
import { ResizableHandle, ResizablePanel } from "../resizable";
import EditorWrapper from "./editor-wrapper";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../button";

export default function ResponsiveEditorWrapper({
    content, defaultLanguage, session_id, wsServerUrl, isAdmin
}: {
    content: string;
    defaultLanguage: string;
    session_id: string;
    wsServerUrl: string;
    isAdmin: boolean
}) {
    const [isEditorEnabled, setIsEditorEnabled] = useState(true)
    return (<>
        <ResizablePanel defaultSize={80} maxSize={90} minSize={40} className={cn("md:block", (!isEditorEnabled? "hidden": "block"))}>
            <EditorWrapper content={content || ""} defaultLanguage={defaultLanguage} room={session_id! as string} wsUrl={wsServerUrl! as string} />
        </ResizablePanel>
        <ResizableHandle />
        <div className="w-[3px] md:hidden bg-red-200 dark:bg-red-700 h-[calc(100vh-50px-57px)]">
            <Button className={cn("absolute top-1/2 -translate-y-1/2 rounded-full z-10", (isEditorEnabled?"right-0":"left-0"))} variant={"destructive"} onClick={() => {
                setIsEditorEnabled(val => !val)
            }}>
                {isEditorEnabled? <ChevronLeft />: < ChevronRight/>}
            </Button>
        </div>
        <ResizablePanel className={cn("md:block", (isEditorEnabled? "hidden": "block"))}>
            <JudgeOutputPane isAdmin={isAdmin} />
        </ResizablePanel>
    </>)
}