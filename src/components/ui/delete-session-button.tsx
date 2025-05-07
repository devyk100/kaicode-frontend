"use client"
import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { getSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { deleteSession } from "@/actions/delete-session";

export default function DeleteSessionButton({ session_id }: {
    session_id: string
}) {
    const {toast} = useToast()
    return (<>
        <Button
            variant={"secondary"}
            onClick={async (event) => {
                event.stopPropagation()
                event.preventDefault()
                const userData = await getSession()
                const success = await deleteSession({
                    session_id: session_id,
                    email: userData?.user.email!
                })
                if(!success) {
                    toast({
                        title: "Failed to delete session",
                        description: "Failed to delete the session try again later"
                    })
                    return;
                }
                window.location.reload()
            }}
            className="z-10 w-12 h-12 rounded-sm" >
            <Trash2 className="relative right-0 w-14 h-14" />
        </Button>
    </>)
}