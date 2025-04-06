"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils"; // Optional: for conditional styling
import { signUpSchema } from "@/lib/validations/signup";
import { createUser } from "@/actions/create-user";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type SignUpData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
    const router = useRouter();

    const [checkingUsername, setCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    });

    const username = form.watch("username");

    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        const timeout = setTimeout(async () => {
            setCheckingUsername(true);
            try {
                const res = await axios.get(`/api/check-username?username=${username}`);
                setUsernameAvailable(res.data.available);
            } catch (e) {
                setUsernameAvailable(null);
            } finally {
                setCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [username]);

    const onSubmit = async (data: SignUpData) => {
        try {
            const result = await createUser({
                email: data.email,
                name: data.name,
                plainPassword: data.password,
                username: data.username
            });
        
            if (result?.success) {
              router.push("/dashboard");
            }
          } catch (err: any) {
            console.log(err)
            toast({title: typeof err === "string" ? err : "Something went wrong", description: String(err)});
          }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Name</Label>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Username</Label>
                            <FormControl>
                                <Input
                                    placeholder="johnny123"
                                    {...field}
                                    className={cn({
                                        "border-green-500": usernameAvailable,
                                        "border-red-500": usernameAvailable === false,
                                    })}
                                />
                            </FormControl>
                            {username && checkingUsername && <p className="text-muted-foreground text-xs">Checking...</p>}
                            {username && usernameAvailable && <p className="text-green-500 text-xs">Username available ✅</p>}
                            {username && usernameAvailable === false && <p className="text-red-500 text-xs">Username taken ❌</p>}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Email</Label>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Password</Label>
                            <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={checkingUsername || usernameAvailable === false}>
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}
