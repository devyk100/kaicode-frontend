import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";
import { db } from "./db/client";
import NextAuth from "next-auth";
import { env } from "process";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs"
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      token?: string;
    };
  }

  interface User {
    id: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    userToken?: string;
    token?: string;
  }
}


// --- Utils ---
function getSecureRandomAlphaString(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (val) => charset[val % charset.length]).join("");
}

function generateUsername(name: string): string {
  const firstName = name.trim().split(" ")[0].toLowerCase();
  const randomNum = crypto.getRandomValues(new Uint32Array(1))[0] % 9000 + 1000;
  const randomAlpha = getSecureRandomAlphaString(10);
  return `${firstName}${randomNum}${randomAlpha}`;
}

// --- Auth Config ---
export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) return null;

    //     const user = await db
    //       .select()
    //       .from(users)
    //       .where(eq(users.email, credentials.email))
    //       .then((res) => res[0]);

    //     // ✅ Reject if no user, or if user was created by OAuth (no password set)
    //     if (!user || !user.password) {
    //       console.warn("Attempt to sign in with credentials for OAuth-only user");
    //       return null;
    //     }

    //     const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    //     if (!passwordMatch) return null;

    //     return {
    //       id: user.id.toString(),
    //       email: user.email,
    //       name: user.name,
    //       token: jwt.sign({ userId: user.id }, process.env.NEXTAUTH_SECRET!, {
    //         expiresIn: "7d"
    //       }),
        
    //     };
    //   }

    // }),

  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (user) {
        token.userId = user.id;
        token.token = user.token;
      }
      
      // Only run when user logs in via provider
      console.log(token, account, profile)
      if (account && profile?.email) {
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, profile.email));

        let userId: number;
        if (existing.length === 0) {
          const inserted = await db.insert(users).values({
            email: profile.email,
            name: profile.name || "",
            username: generateUsername(profile.name!),
            password: null,
          }).returning();
          userId = inserted[0].id;
        } else {
          userId = existing[0].id;
        }

        // ✅ Store the userId from DB in the token
        token.userId = userId.toString();
        const userIdPayload = {
          userId: userId
        }
        token.token = jwt.sign(userIdPayload, env.NEXTAUTH_SECRET as string, {
          expiresIn: "7d", // or "1h", "30m", etc.
        });
      }

      return token;
    },

    async session({ session, token }) {
      // ✅ Put userId into session.user.id
      if (token?.userId) {
        session.user.id = token.userId;
      }
      if (token?.token) {
        session.user.token = token.token;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
