// /app/login/page.tsx
"use client";
import SignInForm from "@/components/ui/sign-in-form";
import { signIn } from "next-auth/react";

export default function Login() {
    return (<>
        <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
        >
            Sign in with Google
        </button>
        <SignInForm />
    </>
    );
}
