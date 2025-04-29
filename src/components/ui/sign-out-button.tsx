"use client"
import { signOut } from "next-auth/react";
import { Button } from "./button";
import { useState } from "react";

export default function SignOutButton() {
    const [loading, setLoading] = useState(false);
    const handleRedirect = async () => {
        if (loading) return;
        setLoading(true);
        signOut()
        // window.location.href = "/login";
    };

    return (<>
        <Button className="p-1 w-full text-sm" variant={"secondary"} onClick={handleRedirect}>
            Sign Out
        </Button>
    </>)
}