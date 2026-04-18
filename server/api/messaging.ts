import { Router } from "express";
import { randomUUID } from "crypto";
import { and, desc, eq, or } from "drizzle-orm";

import { auth } from "./middleWare/auth";
import { db } from "../db/index";
import { messages, users } from "../db/schema"

export const messagesRouter = Router();

messagesRouter.post("/messages", auth, async (req, res) => {
   try {
      const sender = (req as any).user;
      const { receiverId, body } = req.body ?? {};
      if (!receiverId || typeof receiverId !== "string") {
         return res.status(400).json({ error: "missing receiverId" });
      }

    if (!body || typeof body !== "string" || !body.trim()) {
      return res.status(400).json({ error: "message body is required" });
    }

    if (body.length > 2000) {
      return res.status(400).json({ error: "message too long" });
    }

    if (receiverId === sender.userId) {
      return res.status(400).json({ error: "cannot message yourself" });
    }

    const targetUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, receiverId));

    if (!targetUser[0]) {
      return res.status(404).json({ error: "receiver not found" });
    }

    const message = {
      id: randomUUID(),
      senderId: sender.userId,
      receiverId,
      body: body.trim(),
      createdAt: Date.now(),
    };

    await db.insert(messages).values(message);

    return res.status(201).json({ message });
  } catch (err) {
    console.error("create message error:", err);
    return res.status(500).json({ error: "failed to create message" });
  }
});

// get conversation between current user and another user
messagesRouter.get("/messages/:userId", auth, async (req, res) => {
  try {
    const currentUser = (req as any).user;
    const otherUserId = req.params.userId;

    const result = await db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, currentUser.userId),
            eq(messages.receiverId, otherUserId)
          ),
          and(
            eq(messages.senderId, otherUserId),
            eq(messages.receiverId, currentUser.userId)
          )
        )
      )
      .orderBy(desc(messages.createdAt));

    return res.json({ messages: result.reverse() });
  } catch (err) {
    console.error("get messages error:", err);
    return res.status(500).json({ error: "failed to fetch messages" });
  }
});
