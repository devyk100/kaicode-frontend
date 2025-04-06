"use server"
// lib/create-user.ts
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
export async function createUser({
    email,
    plainPassword,
    name,
    username,
  }: {
    email: string;
    plainPassword: string;
    name: string;
    username: string;
  }) {
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) throw "User already exists"; // return string only!
  
    const hashedPassword = await hash(plainPassword, 10);
    await db.insert(users).values({
      email,
      name,
      username,
      password: hashedPassword,
    });
  
    return { success: true };
  }
  