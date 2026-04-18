

import {sqliteTable, text, integer } from "drizzle-orm/sqlite-core"


export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
})

export const messages = sqliteTable("message", {
   id: text("id").primaryKey(),
   senderId: text("sender_id").notNull(),
   receiverId: text("receiver_id").notNull(),
   body: text("body").notNull(),
   createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull()
});
