"use client"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "./button";
import { Switch } from "./switch";
import { CreateSession } from "@/actions/create-session";


export function CreateSessionDialog() {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [enabled, setEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false)
    async function handleCreate() {
        if (isLoading) return; // ⛔ Prevent spamming

        setIsLoading(true);
        let session;
        try {
            session = await CreateSession({
                is_anyone_allowed: enabled,
                name: name
            })
            console.log(session)
        } catch (err) {
            console.error("Error creating session:", err);
        } finally {
            setIsLoading(false);
            setOpen(false)
            window.location.href = `code?session_id=${session?.id}`
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="m-2 text-lg p-5">Create</Button>
            </DialogTrigger>

            <DialogContent className="lg:w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Session</DialogTitle>
                </DialogHeader>
                <span className="text-xs">Name your session</span>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleCreate()
                }}>
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <Label htmlFor="join-mode">Allow Anyone to Join</Label>
                            <Switch id="join-mode" checked={enabled}
                                onCheckedChange={setEnabled}
                            />
                            <p className="ml-4">{enabled ? "On" : "Off"}</p>
                        </div>

                    </div>
                    <Button className="w-full my-2" type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
