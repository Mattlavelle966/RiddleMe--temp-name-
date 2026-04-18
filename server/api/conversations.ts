import { Router } from "express";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { auth } from "./middleWare/auth";
import { db } from "../db/index";
import { conversations, users } from "../db/schema";

export const conversationsRouter = Router();

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

    const conversation = {
      id: randomUUID(),
      type: "dm",
      serverId: null,
      name: typeof name === "string" && name.trim() ? name.trim() : null,
      createdAt: Date.now(),
    };

    await db.insert(conversations).values(conversation);

    return res.status(201).json({ conversation });
  } catch (err) {
    console.error("create conversation error:", err);
    return res.status(500).json({ error: "failed to create conversation" });
  }
});
