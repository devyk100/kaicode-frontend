import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./button";
import { signOut } from "next-auth/react";
import SignOutButton from "./sign-out-button";
import Image from "next/image";

export default async function UserFragment() {
    const user = await getServerSession()
    console.log(user)
    return (<>
        <Popover>
            <PopoverTrigger>

                <div className="flex flex-col items-center justify-center">
                    <Avatar>
                        {user?.user.image ? (
                            <Image
                                src={user.user.image}
                                alt={user.user.name || 'User'}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        ) : (
                            <AvatarFallback>{user?.user?.name![0]}</AvatarFallback>
                        )}
                    </Avatar>
                    <span>
                        {user?.user.name?.split(" ")[0]}
                    </span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="lg:w-[200px]">
                <div className="text-sm flex flex-col gap-2">
                    <div className="text-center">
                        {user?.user.name}
                    </div>
                    <SignOutButton />
                </div>
            </PopoverContent>
        </Popover>
    </>)
}