import { Router } from "express";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

import { auth } from "./middleWare/auth";
import { db } from "../db/index";
import { conversations, conversationMembers, users } from "../db/schema";

export const conversationsRouter = Router();

//This could later be changed to a group of users in terms of functionality
//though I don't know how practical that would be
async function findExistingDm(userAId: string, userBId: string) {
  const memberA = alias(conversationMembers, "memberA");
  const memberB = alias(conversationMembers, "memberB");

  const result = await db
    .select({
      id: conversations.id,
      type: conversations.type,
      name: conversations.name,
      createdAt: conversations.createdAt,
    })
    .from(conversations)
    .innerJoin(
      memberA,
      and(
        eq(memberA.conversationId, conversations.id),
        eq(memberA.userId, userAId)
      )
    )
    .innerJoin(
      memberB,
      and(
        eq(memberB.conversationId, conversations.id),
        eq(memberB.userId, userBId)
      )
    )
    .where(eq(conversations.type, "dm"))
    .limit(1);

  return result[0] ?? null;
}

conversationsRouter.post("/conversations", auth, async (req, res) => {
  try {
    const currentUser = (req as any).user;
    const { type, targetUserId, name } = req.body ?? {};

    if (!type || typeof type !== "string") {
      return res.status(400).json({ error: "missing type" });
    }

    if (type !== "dm") {
      return res.status(400).json({ error: "only dm is supported right now" });
    }

    if (!targetUserId || typeof targetUserId !== "string") {
      return res.status(400).json({ error: "missing targetUserId" });
    }

    if (targetUserId === currentUser.userId) {
      return res.status(400).json({ error: "cannot create dm with yourself" });
    }

    const targetUser = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(eq(users.id, targetUserId));

    if (!targetUser[0]) {
      return res.status(404).json({ error: "target user not found" });
    }

    const existingConversation = await findExistingDm(currentUser.userId, targetUserId);

    if (existingConversation) {
      return res.json({ conversation: existingConversation, existing: true });
    }

    const conversation = {
      id: randomUUID(),
      type: "dm",
      serverId: null,
      name: typeof name === "string" && name.trim() ? name.trim() : null,
      createdAt: new Date(),
    };

    await db.insert(conversations).values(conversation);

    await db.insert(conversationMembers).values([
      { conversationId: conversation.id, userId: currentUser.userId },
      { conversationId: conversation.id, userId: targetUserId },
    ]);

    return res.status(201).json({ conversation });
  } catch (err) {
    console.error("create conversation error:", err);
    return res.status(500).json({ error: "failed to create conversation" });
  }
});
