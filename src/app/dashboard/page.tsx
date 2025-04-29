import { getSessionsForUser } from "@/actions/get-previous-sessions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateSessionDialog } from "@/components/ui/create-session-dialog";
import UserFragment from "@/components/ui/dashboard-user-fragment";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await getServerSession();
    if(user == null) {
        redirect("/login")
    }
    const sessions = await getSessionsForUser(user?.user.email as string)
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
                <h3 className="text-2xl font-semibold">
                    Previous Sessions
                </h3>
                <div className="w-full h-full flex flex-col gap-2 mt-4 border-t-[0.5px] p-2">
                    {sessions.map((val, index) => {
                        return (<>
                            <Link
                                key={index}
                                href={`/code?session_id=${val.id}`}
                                className="cursor-pointer hover:dark:bg-slate-900 rounded-md hover:bg-slate-200 p-2"
                            >
                                <h4 className="text-xl font-semibold">
                                    {val.name}
                                </h4>
                                <span className="italic text-sm">
                                    {val.id}
                                </span>
                            </Link>
                        </>)
                    })}
                </div>
            </div>
        </section>
    </>)
}