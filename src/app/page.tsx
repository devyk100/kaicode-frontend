"use client"
import { authConfig } from "@/auth";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/ui/dark-mode-toggle";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  // const session = await getServerSession();
  // console.log(session)
  useEffect(() => {
    (async () => {
      console.log(await getSession())
    })()
  })

  return (
    <div className=""> 
    <Button>Create Session</Button>
    </div>
  );
}
