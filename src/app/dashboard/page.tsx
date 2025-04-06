import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateSessionDialog } from "@/components/ui/create-session-dialog";
import UserFragment from "@/components/ui/dashboard-user-fragment";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {

    return (<>
        <section className="w-screen flex flex-col items-center justify-center">
            <div className="w-[70%] mt-8 border-b-2 p-2 flex justify-between">
                <div className="flex flex-col w-fit items-start">
                    <CreateSessionDialog />
                    <div className="px-2">
                        Create new session to start programming collaboratively.
                    </div>
                </div>
                <UserFragment />
            </div>
            <div className="w-[70%] p-4">
                <span className="text-2xl font-semibold">
                    Previous Sessions
                </span>
            </div>
        </section>
    </>)
}