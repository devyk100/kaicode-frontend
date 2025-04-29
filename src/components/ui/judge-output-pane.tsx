"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Button } from "./button";
import { useCodeStore } from "@/store/use-code-store";
import { useEffect, useRef, useState } from "react";
import { Event, useSyncWsStore } from "@/store/use-sync-ws-store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import RunningCodeAnimation from "./running-code-animation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Textarea } from "./textarea";
import { useLanguageStore } from "@/store/use-language-store";


function createJudgeEvent(code: string, language: string, room_name: string, input: string): Event {
    return {
        event: "judge",
        content: code,
        language: language,
        input: input,
        room_name: room_name
    }
}
function formatDuration(ms: number): string {
    if (ms >= 1000) {
        return `${(ms / 1000).toFixed(2)} s`;
    } else {
        return `${ms.toFixed(2)} ms`;
    }
}


export default function JudgeOutputPane() {
    const { code } = useCodeStore()
    const { socket, roomname, setJudgeOutputCallback } = useSyncWsStore()
    const [isRunning, setIsRunning] = useState(false)
    const [output, setOutput] = useState<string[]>()
    const inputTextRef = useRef<HTMLTextAreaElement>(null)
    const [timeTaken, setTimeTaken] = useState<string | undefined>(undefined)
    const {language} = useLanguageStore()
    function onCodeSubmit(code: string, socket: WebSocket) {
        console.log("The code being submitted is", code)
        const event = createJudgeEvent(code, language, roomname, inputTextRef.current?.value! || " ")
        socket.send(JSON.stringify(event))
        setIsRunning(true)
    }

    function onSoloCodeSubmit(code: string) {
        
    }

    useEffect(() => {
        setJudgeOutputCallback((event) => {
            setOutput(event.content.split('\n'));
            setTimeTaken(formatDuration(event.time_taken!))
            setIsRunning(false)
        })
    }, [])

    return <>
        <div className="h-full w-full flex flex-col items-center justify-center gap-3">
            {!isRunning ? <div className="flex gap-2">
                <Button onClick={() => onCodeSubmit(code, socket!)}>Run Code</Button>
                <Button>Run Code in Solo</Button>
            </div> : <><RunningCodeAnimation /></>}

            <ResizablePanelGroup direction="vertical" className="h-100">
                <ResizablePanel defaultSize={70} minSize={50} maxSize={90}>
                    <div className="h-full w-full flex flex-col items-center gap-2 p-2 border-t-2 ">
                        <div className="flex justify-between w-full">
                            <h3 className="font-semibold text-xl">Output</h3>
                            {timeTaken ? <h5 className="text-sm dark:text-slate-300">Time Taken: {timeTaken}</h5> : ""}
                        </div>
                        <ScrollArea className="h-full w-full rounded-md border py-4" >
                            <ScrollBar orientation="horizontal" />
                            {output?.map((val, index) => {
                                return (
                                    <div key={index} className="flex m-1 items-start">
                                        <div className="font-mono border-r-2 px-2">{index + 1}</div>
                                        <div className="whitespace-nowrap px-2">
                                            {val}
                                        </div>
                                    </div>
                                )
                            })}
                        </ScrollArea>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <div className="h-full w-full flex flex-col items-center p-2 gap-2">
                        <h3 className="font-semibold text-xl">
                            Inputs
                        </h3>
                        <Textarea ref={inputTextRef} className="w-full h-full" />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    </>
}