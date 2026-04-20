import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"


export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
})

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  senderId: text("sender_id").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // dm | group | channel
  serverId: text("server_id"),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const conversationMembers = sqliteTable(
  "conversation_members", 
  {
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.conversationId, table.userId] }),
  })
);
