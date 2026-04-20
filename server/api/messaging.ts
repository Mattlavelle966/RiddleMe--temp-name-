import { Router } from "express";
import { randomUUID } from "crypto";
import { asc, eq } from "drizzle-orm";

import { auth } from "./middleWare/auth";
import { db } from "../db/index";
import { messages, conversations } from "../db/schema";

export const messagesRouter = Router();

messagesRouter.post("/messages", auth, async (req, res) => {
  try {
    const sender = (req as any).user;
    const { conversationId, body } = req.body ?? {};

    if (!conversationId || typeof conversationId !== "string") {
      return res.status(400).json({ error: "missing conversationId" });
    }

    if (!body || typeof body !== "string" || !body.trim()) {
      return res.status(400).json({ error: "message body is required" });
    }

    if (body.length > 2000) {
      return res.status(400).json({ error: "message too long" });
    }

    const conversation = await db
      .select({ id: conversations.id, type: conversations.type })
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!conversation[0]) {
      return res.status(404).json({ error: "conversation not found" });
    }

    const message = {
      id: randomUUID(),
      conversationId,
      senderId: sender.userId,
      body: body.trim(),
      createdAt: new Date(),
    };

    await db.insert(messages).values(message);

	const io = req.app.get('io'); 
    if (io) {
      const room = String(conversationId);
      io.to(room).emit("messageCreated", { message }); 
      console.log(`Broadcasted new message to room: ${room}`);
    } else {
      console.warn("Socket.io instance not found on req.app");
    }

    return res.status(201).json({ message });
  } catch (err) {
    console.error("create message error:", err);
    return res.status(500).json({ error: "failed to create message" });
  }
});

messagesRouter.get("/messages/:conversationId", auth, async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    const conversation = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!conversation[0]) {
      return res.status(404).json({ error: "conversation not found" });
    }

    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    return res.json({ messages: result });
  } catch (err) {
    console.error("get messages error:", err);
    return res.status(500).json({ error: "failed to fetch messages" });
  }
});
