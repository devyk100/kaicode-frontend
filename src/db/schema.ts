import {
    bigint,
    boolean,
    customType,
    pgTable,
    serial,
    text,
    timestamp,
    uuid,
  } from "drizzle-orm/pg-core";
  
  const bytea = customType<{
    data: Buffer;
    driverData: Buffer;
  }>({
    dataType() {
      return "bytea";
    },
  });
  
  // ---------------------- USERS ----------------------
  export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  // ---------------------- SESSIONS ----------------------
  export const sessions = pgTable("sessions", {
    id: uuid("id").defaultRandom().primaryKey(), // UUID with default gen
    content: bytea("content"),
    whiteboardContent: bytea("whiteboard_content"),
  });
  
  // ---------------------- MAPPING ----------------------
  export const sessionToUserMapping = pgTable("session_to_user_mapping", {
    id: serial("id").primaryKey(),
    sessionId: uuid("session_id").notNull().references(() => sessions.id),
    userId: bigint("user_id", { mode: "number" }).notNull().references(() => users.id),
    is_admin: boolean("is_admin").notNull()
  });
  