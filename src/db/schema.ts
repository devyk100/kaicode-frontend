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
    name: text("name").notNull(),
    content: bytea("content"),
    whiteboardContent: bytea("whiteboard_content"),
    is_anyone_allowed: boolean("is_anyone_allowed").notNull()
  });
  
  // ---------------------- MAPPING ----------------------
  export const sessionToUserMapping = pgTable("session_to_user_mapping", {
    id: serial("id").primaryKey(),
    sessionId: uuid("session_id").notNull().references(() => sessions.id),
    user_email: text("user_email").notNull().references(() => users.email),
    is_admin: boolean("is_admin").notNull()
  });
  