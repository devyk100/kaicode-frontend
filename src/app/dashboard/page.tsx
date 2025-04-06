import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateSessionDialog } from "@/components/ui/create-session-dialog";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
    const user = await getServerSession()
    console.log(user)
    return (<>
        <section className="w-screen flex flex-col items-center justify-center">
            <div className="w-[70%] mt-8 border-b-2 p-2 flex justify-between">
                <div className="flex flex-col w-fit items-start">
                    <CreateSessionDialog />
                    <div className="px-2">
                        Create new session to start programming collaboratively.
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Avatar>
                        <AvatarImage src={user?.user.image} alt="@shadcn" />
                        <AvatarFallback>{user?.user?.name![0]}</AvatarFallback>
                    </Avatar>
                    <span>
                        {user?.user.name?.split(" ")[0]}
                    </span>
                </div>
            </div>
            <div className="w-[70%] p-4">
                <span className="text-2xl font-semibold">
                    Previous Sessions
                </span>
            </div>
        </section>
    </>)
}