"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMapSetStore } from "@/store/use-colormap-store";
import { useEffect, useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


export default function UpperLegendPane({
    language
}: {
    language: string;
}) {
    const { data } = useMapSetStore()
    useEffect(() => {
        console.log(data, "is the map of user name to color")
    }, [data])
    return (<>
        <div className="h-[50px] flex w-full items-center p-1">
            <Select value={language} onValueChange={(val) => {
                console.log("value changed to this", val)
                // make a call to change the language of this session, only allowed by the admin
            }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="go">Golang</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex w-full h-full items-center justify-center">
                {
                    [...data.entries()].length > 0 ?
                        <>
                            <span className="whitespace-nowrap  font-semibold h-full p-2">
                                Users connected:
                            </span>
                            <ScrollArea className="w-full h-full p-0 m-0 rounded-md" >
                                <div className="whitespace-nowrap p-2">
                                    {[...data.entries()].map(([user_name, inside_set]) => {
                                        return (<span key={user_name} className="flex items-center justify-center w-fit">
                                            {user_name}: {[...inside_set].map(([color, clientId]) => {
                                                return (<>
                                                    <span className={`mx-1 h-3 w-3 block rounded-full`} style={{ backgroundColor: color }}
                                                        key={clientId}>
                                                    </span>
                                                </>)
                                            })}
                                        </span>)
                                    })}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </>
                        : <span className="whitespace-nowrap w-full h-full p-2">
                            No other users connected yet
                        </span>
                }

            </div>



        </div>
    </>)
}