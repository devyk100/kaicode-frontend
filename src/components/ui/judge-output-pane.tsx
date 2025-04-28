"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Button } from "./button";
import { useCodeStore } from "@/store/use-code-store";
import { useEffect } from "react";

export default function JudgeOutputPane() {
    const {code} = useCodeStore()
    // const {}
    return <>
        <div className="h-full w-full flex flex-col items-center justify-center gap-3">
            <Button onClick={() => {
                console.log(code, 'is the code')
            }}>Run Code</Button>
            <ResizablePanelGroup direction="vertical" className="h-100">
                <ResizablePanel defaultSize={70} minSize={50} maxSize={90}>
                    <div className="h-full w-full flex flex-col items-center gap-2 p-2 border-t-2 ">
                        <h3 className="font-semibold text-xl">Output</h3>
                        <div>
                            Hello
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <div className="h-full w-full flex flex-col items-center p-2 gap-2">
                        <h3 className="font-semibold text-xl">
                            Previous Outputs
                        </h3>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    </>
}