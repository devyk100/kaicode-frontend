import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Add other providers like GitHub, Google if needed
import { authConfig } from "@/auth";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
