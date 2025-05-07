"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Cross, Play, Share, User, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchAllowedUsers } from "@/actions/fetch-allowed-users";
import { Input } from "./input";
import { addUserPermission } from "@/actions/add-user-permission";
import { removeUserPermission } from "@/actions/remove-user-permission";


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

export function ShareButton() {
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            toast({
                title: "Copied link to clipboard",
                description: "Shared this with your friends to let them join this session.",
                className: "dark:bg-slate-900 bg-slate-100"
            })
        }).catch((err) => {
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <Button variant="secondary" onClick={handleShare}>
            Share <Share className="ml-2 h-4 w-4" />
        </Button>
    );
}

function UserPermissions({ session_id }: {
    session_id: string
}) {
    const [allowedUsers, setAllowedUsers] = useState<{
        id: number;
        sessionId: string;
        user_email: string;
        is_admin: boolean;
    }[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [refresh, setRefresh] = useState(Math.random())
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        (async () => {
            if (session_id == "" || session_id == null || session_id == undefined) return;
            const mappings: {
                id: number;
                sessionId: string;
                user_email: string;
                is_admin: boolean;
            }[] = await fetchAllowedUsers({ session_id })
            console.log("MAPPING", mappings)
            setAllowedUsers(mappings)
        })()
    }, [isOpen, refresh])
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="bg-slate-800 p-1 rounded-md">
                <User />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="">User Permissions.</DialogTitle>
                    <DialogDescription className="flex flex-col gap-2 mt-2">
                        Add or remove users allowed to this session.
                        (WORKS ONLY WHEN THE PERMISSION IS "NOT ANYONE CAN JOIN")
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center">
                    <form className="flex gap-3 justify-around mb-2" onSubmit={async (event) => {
                        event.preventDefault()
                        const email = inputRef.current?.value;

                        await addUserPermission({
                            email: email as string,
                            session_id: session_id
                        })

                        setTimeout(() => {
                            setRefresh(Math.random())
                        }, 2000)

                        if (inputRef.current) {
                            inputRef.current.value = "";
                        }
                    }}>
                        <Input className="w-[300px]" ref={inputRef} />
                        <Button type="submit">
                            Add user
                        </Button>
                    </form>
                    <ScrollArea>
                        {allowedUsers.length == 1 ? "No one here yet" : ""}
                        {allowedUsers.map(val => {
                            if (val.is_admin) return <></>
                            return (<>
                                <div key={val.id} className="flex items-center justify-between w-full px-2">
                                    <div className="text-sm">
                                        {val.user_email}
                                    </div>
                                    <span className="cursor-pointer p-2" onClick={async () => {
                                        await removeUserPermission({ email: val.user_email, session_id: val.sessionId })
                                        setTimeout(() => {
                                            setRefresh(Math.random())
                                        }, 2000)
                                    }}>
                                        <X />
                                    </span>
                                </div>
                            </>)
                        })}<ScrollBar orientation="vertical" />
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}



export default function JudgeOutputPane({ isAdmin }: {
    isAdmin: boolean
}) {
    const { code } = useCodeStore()
    const { socket, roomname, setJudgeOutputCallback } = useSyncWsStore()
    const [isRunning, setIsRunning] = useState(false)
    const [output, setOutput] = useState<string[]>()
    const inputTextRef = useRef<HTMLTextAreaElement>(null)
    const [timeTaken, setTimeTaken] = useState<string | undefined>(undefined)
    const { language } = useLanguageStore()
    function onCodeSubmit(code: string, socket: WebSocket) {
        console.log("The code being submitted is", code)
        const event = createJudgeEvent(code, language, roomname, inputTextRef.current?.value! || " ")
        socket.send(JSON.stringify(event))
        setIsRunning(true)
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
            <div className="flex gap-2 justify-between w-full px-2">

                {!isRunning ? <Button onClick={() => onCodeSubmit(code, socket!)}> <Play /> Run Code</Button> : <><RunningCodeAnimation /></>}
                {
                    isAdmin ?
                        <UserPermissions session_id={roomname} /> : ""
                }
                <ShareButton />
            </div>

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